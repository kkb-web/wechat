#!/bin/bash
set -e

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

NOWDATE=`date '+%Y-%m-%d %H:%M:%S'`
README_FILE="./healthCheck.json"
BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
BRANCH=`echo $BRANCH | sed 's#\/#\\\/#g'`
STATUS='UP'

LAST_COMMIT_ID=$(git log --pretty=format:"%h" | head -1  | awk '{print $1}')

rm -rf ./healthCheck.json

cp './healthCheck.json' $README_FILE

perl -p -i -e "s/_status/$STATUS/g" $README_FILE
perl -p -i -e "s/_gitBranch/$BRANCH/g" $README_FILE
perl -p -i -e "s/_buildDate/$NOWDATE/g" $README_FILE
perl -p -i -e "s/_lastCommitId/$LAST_COMMIT_ID/g" $README_FILE

echo 'DONE'

exit 0
