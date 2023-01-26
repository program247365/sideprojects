use crate::db::establish_connection;
use serde::Serialize;

use crate::diesel::RunQueryDsl;

#[derive(Debug, Queryable, Serialize, QueryableByName)]
pub struct DomainsQuery {
    #[diesel(sql_type = diesel::sql_types::Integer)]
    pub id: i32,
    #[diesel(sql_type = diesel::sql_types::Text)]
    pub url: String,
}

#[derive(Debug, Serialize)]
pub struct DomainsQueryResult {
    list: Vec<DomainsQuery>,
}

pub fn get_all_domains() -> DomainsQueryResult {
    let mut connection = establish_connection();
    let sql_domains = "
    SELECT
      id,
      url
    FROM domains 
  ";

    let domains = diesel::sql_query(sql_domains)
        .load::<DomainsQuery>(&mut connection)
        .unwrap_or(vec![]);

    println!("{:?}", domains);

    DomainsQueryResult { list: domains }
}
