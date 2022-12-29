library(jsonlite)
library(dplyr)
library(ggplot2)
library(plotly)
library(tidyr)
library(data.table)

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
  df_s_f = rbind(df_s_f,data)
}

df_s_f = df_s_f %>% select(!starts_with('errors'))






