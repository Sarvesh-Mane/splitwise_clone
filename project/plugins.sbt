// Tell SBT to downgrade eviction strictness to warnings for plugins
evictionErrorLevel := Level.Warn

// Load the Play 2.8.22 plugin ecosystem
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.22")

addSbtPlugin("com.typesafe.play" % "sbt-play-ebean" % "6.2.0")