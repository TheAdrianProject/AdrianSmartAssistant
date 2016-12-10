echo "Adrian Update Script. 1.0 "
echo "----------------------------------------------------------------"
echo "Make sure you have commited all your local changes into a branch"
echo "The master branch will be updated to the latest remote version"

read -p "If you are ready press [Y] or [N] to cancel " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
	git checkout master
    git fetch && git reset --hard origin/master
fi 