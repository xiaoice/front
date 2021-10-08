branchName=`git symbolic-ref --short -q HEAD`
#read -p  '请输入git提交代码备注: ' msg
# $msg

git add .
git commit -m 'init'
echo "\033[33m 提交git仓库中，请稍后... \033[0m"
git push origin $branchName
echo "\033[32m git 提交完毕！ \033[0m"
