use super::schema::domains;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Serialize, Deserialize, Debug, Clone, Insertable, Identifiable)]
pub struct Domain {
    pub id: Option<i32>,
    pub url: String,
}
