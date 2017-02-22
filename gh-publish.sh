#!/usr/bin/env bash
cd "$(dirname "$0")"

function cleanup()
{
    git rm --cached -r .
    git checkout -f master
    git rm --cached -r .
    git add .
    if [ -n "${GH_PUB_STASH+1}" ];
    then
        git stash pop
    fi
    exit 0
}

git checkout master

# don't publish un-commited files
git stash | grep 'No local changes to save' &> /dev/null
if [ $? != 0 ]; then
    GH_PUB_STASH=1
fi

# wait until after this stashing stuff to register this
trap 'cleanup' ERR

git branch -D gh-pages
git checkout -b gh-pages

git rm --cached -r .

npm run setup-release

while read -r line
do
    [ -z "$line" ] && continue
    if [[ ${line:0:1} != '#' ]]
    then
        git add -f $line
    fi
done < ".publish-list"

git commit -m "Publish new version $(date +%Y-%m-%d-%H:%M:%S)"
git push -f origin gh-pages

cleanup
