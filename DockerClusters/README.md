# Data Science Course at SDU

The course/repo is run/maintained by Jakob Hviid <jah@mmmi.sdu.dk> and Fisayo Caleb Sangogboye <fsan@mmmi.sdu.dk>.

## Setup

In the root directory run the following from an administrative terminal:

```bash
docker-compose up -d
addroute.cmd
```

also, add a file to the HDFS setup by attaching to the namenode and running:

```bash
apt update
apt install wget
wget -O alice.txt https://www.gutenberg.org/files/11/11-0.txt
hdfs dfs -put alice.txt /
```

A sample of how to connect to spark is provided in example.py, which currently reads the alice.txt file and makes a word count.

`Important! Currently pyspark requires that it is run with python version 3.7.5 or lower so if you have python 3.8 installed it will not work.`
[See this issue for more info](https://github.com/pyinstaller/pyinstaller/issues/4265)

## Credits

This repo consists of several components created by Data Science Europe, but has been restructured into a part of a course run at the University of Southern Denmark.
The repositories are as follows:

- https://github.com/big-data-europe/docker-hadoop
- https://github.com/big-data-europe/docker-spark
