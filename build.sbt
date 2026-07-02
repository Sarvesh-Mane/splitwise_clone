name := """splitwise_clone"""
organization := "savify"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava, PlayEbean)

scalaVersion := "2.13.14"

libraryDependencies ++= Seq(
  guice,
  javaJdbc,
  filters,
  "mysql" % "mysql-connector-java" % "8.0.33",
  "io.ebean" % "ebean" % "12.16.1",
  "io.ebean" % "ebean-agent" % "12.16.1",
  "org.mindrot" % "jbcrypt" % "0.4",
  "com.auth0" % "java-jwt" % "4.4.0",
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.15.2",
  "ch.qos.logback" % "logback-classic" % "1.2.12",
  "net.logstash.logback" % "logstash-logback-encoder" % "6.6"
)

playEbeanModels in Compile := Seq("models.*")