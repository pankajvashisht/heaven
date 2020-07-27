import axios from 'axios';
const apis = `https://18.220.10.58/admins`;
const header = {
	headers: {
		token: '',
	},
};
let login_datails = '';
const details = () => {
	if (typeof localStorage.getItem('users') === 'string') {
		login_datails = JSON.parse(localStorage.getItem('users'));
	}
	if (typeof login_datails === 'object') {
		login_datails = JSON.parse(localStorage.getItem('users'));
		header.headers.token = login_datails.token;
	}
};
details();
export const Adminlogin = ({ email, password }) => {
	return axios.post(`${apis}/login`, {
		email,
		password,
	});
};

export const UserList = ({ page, query, limit }) => {
	return axios.get(
		`${apis}/users/${page}/${limit}?token=${login_datails.token}&q=${query}`
	);
};
export const Seeds = ({ page, query, limit }) => {
	return axios.get(
		`${apis}/seeds/${page}/${limit}?token=${login_datails.token}&q=${query}`
	);
};
export const Tithe = ({ page, query, limit }) => {
	return axios.get(
		`${apis}/tithe/${page}/${limit}?token=${login_datails.token}&q=${query}`
	);
};
export const editSeedDetails = (data) => {
	return axios.put(`${apis}/seeds?token=${login_datails.token}`, data);
};
export const editTitheDetails = (data) => {
	return axios.put(`${apis}/tithe?token=${login_datails.token}`, data);
};
export const Transaction = ({ page, query, limit }) => {
	return axios.get(
		`${apis}/transaction/${page}/${limit}?token=${
			login_datails.token
		}&q=${query}`
	);
};
export const dashBaord = () => {
	details();
	return axios.get(`${apis}/dashboard?token=${login_datails.token}`);
};
export const appInfo = () => {
	return axios.get(`${apis}/appInfo?token=${login_datails.token}`);
};

export const appInfoUpdate = (data) => {
	return axios.put(`${apis}/appInfo?token=${login_datails.token}`, {
		table: data.table,
		id: data.id,
		value: data.value,
	});
};

export const updateUser = (data) => {
	return axios.put(`${apis}/users?token=${login_datails.token}`, {
		table: data.table,
		id: data.id,
		status: data.status,
	});
};

export const deleteUser = (data) => {
	return axios.delete(
		`${apis}/users?token=${login_datails.token}`,
		{ data },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);
};

export const addUser = (userForm) => {
	let form = new FormData();
	form.append('name', userForm.name);
	form.append('password', userForm.password);
	form.append('email', userForm.email);
	form.append('phone', userForm.phone);
	return axios.post(`${apis}/users?token=${login_datails.token}`, form, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};
export const EditUser = (data) => {
	return axios.put(`${apis}/users?token=${login_datails.token}`, {
		table: 'users',
		id: data.id,
		name: data.name,
	});
};
