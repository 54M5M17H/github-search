let isExpanded = false;
const ENTER = 13;

const getStore = (key) => new Promise(resolve => chrome.storage.sync.get(key, resolve));
const setStore = (key, data) => chrome.storage.sync.set({ [key]: data });

const searchHandler = async ({ keyCode, target: { value } }) => {
	if (keyCode !== ENTER || !value) return;

	let { users } = await getStore('users');
	if (!users) users = [];
	const userString = users.map(u => `+user%3A${u}`).join('');
	const url = `http://github.com/search?q=${value}${userString}&type=Repositories`
	chrome.tabs.create({ url });
}

const hideUsers = () => {
	const users = usersInput.value.split(',').map(u => u.trim());
	setStore('users', users);

	usersInput.style.display = 'none';
	up.style.display = 'none';
	down.style.display = 'inline';
	isExpanded = false;
}

const showUsers = async () => {
	usersInput.style.display = 'block';
	down.style.display = 'none';
	up.style.display = 'inline';
	isExpanded = true;
	const { users } = await getStore('users');
	if (!users) return;
	usersInput.value = users.join(', ');
}

const expanderHandler = () => {
	if (isExpanded) return hideUsers();
	showUsers();
}

const searchInput = document.getElementById('search');
const usersInput = document.getElementById('users');
const down = document.getElementById('down');
const up = document.getElementById('up');
const expander = document.getElementById('expand');

searchInput.addEventListener('keypress', searchHandler);
expander.addEventListener('click', expanderHandler);

searchInput.focus();
