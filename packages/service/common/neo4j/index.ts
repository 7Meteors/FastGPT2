const neo4j = require('neo4j-driver');

// 从环境变量中获取连接信息
const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

// 创建驱动实例
export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
