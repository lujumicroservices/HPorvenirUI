import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUsers = createAsyncThunk('contactsApp/contacts/getContacts', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().contactsApp.contacts.routeParams;
	const response = await axios.get('/api/contacts-app/contacts', {
		params: routeParams
	});
	const data = await response.data;

	return { data, routeParams };
});

export const addUser = createAsyncThunk('contactsApp/contacts/addContact', async (contact, { dispatch, getState }) => {
	const response = await axios.post('/api/contacts-app/add-contact', { contact });
	const data = await response.data;

	dispatch(getUsers());

	return data;
});

export const updateUser = createAsyncThunk(
	'contactsApp/contacts/updateContact',
	async (contact, { dispatch, getState }) => {
		const response = await axios.post('/api/contacts-app/update-contact', { contact });
		const data = await response.data;

		dispatch(getUsers());

		return data;
	}
);

export const removeUser = createAsyncThunk(
	'contactsApp/contacts/removeContact',
	async (contactId, { dispatch, getState }) => {
		await axios.post('/api/contacts-app/remove-contact', { contactId });

		return contactId;
	}
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUsersById } = usersAdapter.getSelectors(
	state => state.usersApp.users
);

const usersSlice = createSlice({
	name: 'contactsApp/contacts',
	initialState: usersAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		contactDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setUsersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openNewSearchDialog: (state, action) => {
			state.userDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewUserDialog: (state, action) => {
			state.userDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditUserDialog: (state, action) => {
			state.userDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditUserDialog: (state, action) => {
			state.userDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[updateUser.fulfilled]: usersAdapter.upsertOne,
		[addUser.fulfilled]: usersAdapter.addOne,
		[removeUser.fulfilled]: (state, action) => usersAdapter.removeMany(state, action.payload),
		[removeUser.fulfilled]: (state, action) => usersAdapter.removeOne(state, action.payload),
		[getUsers.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			usersAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const { setUsersSearchText, openNewUserDialog, closeNewUserDialog, openEditUserDialog, closeEditUserDialog } =
	usersSlice.actions;

export default usersSlice.reducer;
