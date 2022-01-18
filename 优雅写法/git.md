### git 合并请求
``` bash
git add .
git commit -m 'test:'

git rebase -i HEAD~3
git push origin master -f


git log
git rebase -i logid
```

### git lfs大文件
```base
git lfs update
git lfs fetch --all origin
git remote set-url origin ssh://git@e.codingcorp.net:bad.git
git lfs update
git lfs push --all origin
```
