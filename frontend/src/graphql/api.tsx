import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_ME = gql`
	query Me {
		me {
			id
			name
			email
		}
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($name: String!) {
		updateUser(name: $name) {
			id
			name
			email
		}
	}
`;

export const GET_CATEGORIES = gql`
	query Categories {
		categories {
			id
			title
			description
			icon
			color
		}
	}
`;

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($data: CategoryCreateInput!) {
		createCategory(data: $data) {
			id
			title
			description
			icon
			color
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($id: String!, $data: CategoryUpdateInput!) {
		updateCategory(id: $id, data: $data) {
			id
			title
			description
			icon
			color
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: String!) {
		deleteCategory(id: $id)
	}
`;

export const GET_TRANSACTIONS = gql`
	query Transactions {
		transactions {
			id
			description
			amount
			date
			type
			categoryId
			category {
				id
				title
				icon
				color
			}
		}
	}
`;

export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($data: TransactionCreateInput!) {
		createTransaction(data: $data) {
			id
			description
			amount
			date
			type
			categoryId
			category {
				id
				title
				icon
				color
			}
		}
	}
`;

export const UPDATE_TRANSACTION = gql`
	mutation UpdateTransaction($id: String!, $data: TransactionUpdateInput!) {
		updateTransaction(id: $id, data: $data) {
			id
			description
			amount
			date
			type
			categoryId
			category {
				id
				title
				icon
				color
			}
		}
	}
`;

export const DELETE_TRANSACTION = gql`
	mutation DeleteTransaction($id: String!) {
		deleteTransaction(id: $id)
	}
`;