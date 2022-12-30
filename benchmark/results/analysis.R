library(jsonlite)
library(dplyr)
library(ggplot2)
library(plotly)
library(tidyr)
library(data.table)
library(zoo)

#disable scientific notation
options(scipen=999)

############################################# Concurrent ##############################################################################################
#load json files and transform them
df_c <- data.frame()

files = c("concurrent_createProduct_GraphQL",
         "concurrent_createProduct_REST",
         "concurrent_getProductBoughtByUser_GraphQL",
         "concurrent_getProductBoughtByUser_REST",
         "concurrent_getUsers_REST",
         "concurrent_getUsers_GraphQL")



for(file in files){
  print(file)
  data <- fromJSON(paste0("concurrent/",file,".json"))
  data <- bind_rows(data, .id = 'concurrent_user')
  data['type'] = file
  df_c = rbind(df_c,data)
}

rm(data)
df_c = do.call(data.frame,df_c)

#compute the percentage of success, errors and timeout for each concurrent user (1,10,100,1000,10000)
p = df_c %>% select("type","concurrent_user","X2xx","errors","timeouts") %>%
  group_by(type,concurrent_user) %>%
  summarise(X2xx = sum(X2xx),
            errors = sum(errors),
            timeouts = sum(timeouts)) %>%
  ungroup() %>%
  gather("key", "value",3:5) %>%
  group_by(type, concurrent_user) %>%
  mutate(percent = round(value / sum(value) * 100,digits = 2)) %>%
  ungroup() %>% 
  arrange(type,concurrent_user) %>%
  ggplot(.,aes(x=concurrent_user,y=percent,fill=key)) +
  geom_bar(stat="identity") + 
  facet_grid(.~type) + theme_bw()

ggplotly(p)

############################################# Sequential ##############################################################################################

df_s_f = data.frame()

files = c("few_data/sequential_createProduct_GraphQL",
          "few_data/sequential_createProduct_REST",
          "few_data/sequential_userThatBoughtProduct_GraphQL",
          "few_data/sequential_userThatBoughtProduct_REST",
          "few_data/sequential_getUsers_REST",
          "few_data/sequential_getUsers_GraphQL")


for(file in files){
  print(file)
  data <- fromJSON(paste0("sequential/",file,".json"))
  data <- data.table::rbindlist(list(data), fill = TRUE) %>% as.data.frame()
  data['type'] = file
  df_s_f = dplyr::bind_rows(df_s_f,data)
}

df_s_f <- df_s_f %>% select(!starts_with('errors')) %>%
  tidyr::separate(data = .,col = type,sep = "_",into = c("to_remove","to_remove2","func","type"),remove = FALSE) %>%
  select(-c("to_remove","to_remove2")) %>%
  tidyr::gather("requests","time",1:5) %>%
  mutate(requests = as.integer(requests))

#make a copy of df_s_f -> will be used for stats
copy_df_s_f <- df_s_f

#generate a dataframe with all values between 1 and 10000
tmp_df <- data.frame(func=unique(df_s_f$func),type=unique(df_s_f$type),requests=rep(1:10000,each=6))

df_s_f <- tmp_df %>% left_join(df_s_f %>%
                                 group_by(func,type,requests) %>%
                                 summarise(time = mean(time,na.rm=T)) %>%
                                 ungroup() ,by=c("func","type","requests"))

rm(tmp_df)

df_s_f <- df_s_f %>% 
  group_by(func,type) %>% 
  arrange(func,type,requests) %>% 
  mutate(times = na.spline(time)) %>% 
  ungroup() %>%
  mutate(times = ifelse(func == "userThatBoughtProduct" & requests > 1000, NA, times))

p1 = ggplot(df_s_f,aes(x=requests,y=times,color=type)) + geom_line()  + facet_wrap(func~.,scales="free_y") + theme_bw() 

ggplotly(p1)

p2 = copy_df_s_f %>% mutate(requests = as.factor(requests)) %>% ggplot(data=.) + geom_boxplot(aes(x=requests,y=time,color=type)) + facet_wrap(func~.,scales="free_y") + theme_bw() 

ggplotly(p2)