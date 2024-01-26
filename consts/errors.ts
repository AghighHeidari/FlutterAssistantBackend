export const errors = {
	INTERNAL_SERVER_ERROR: {
		key: 'internal_server_error',
		message: {
			en: 'Internal server error.',
			fa: 'خطای سرور.'
		},
		responseCode: 500
	},
	USERNAME_IS_REQUIRED: {
		key: 'username_is_required',
		message: {
			en: 'Username is required!',
			fa: 'نام کاربری الزامی است!'
		},
		responseCode: 400
	},
	PASSWORD_IS_REQUIRED: {
		key: 'password_is_required',
		message: {
			en: 'Password is required!',
			fa: 'رمز عبور الزامی است!'
		},
		responseCode: 400
	},
	USER_NOT_FOUND: {
		key: 'user_not_found',
		message: {
			en: 'User not found!',
			fa: 'کاربر یافت نشد!'
		},
		responseCode: 401
	},
	USERNAME_ALREADY_EXISTS: {
		key: 'username_already_exists',
		message: {
			en: 'Username already exists!',
			fa: 'نام کاربری قبلا ثبت شده است!'
		},
		responseCode: 400
	},
	CREATING_THREAD_FAILED: {
		key: 'creating_thread_failed',
		message: {
			en: 'Creating thread failed!',
			fa: 'ایجاد thread با خطا مواجه شد!'
		},
		responseCode: 500
	},
	HANDLING_PROMPT_FAILED: {
		key: 'handling_prompt_failed',
		message: {
			en: 'Handling prompt failed!',
			fa: 'پردازش prompt با خطا مواجه شد!'
		},
		responseCode: 500
	},
	BUILD_NOT_FOUND: {
		key: 'build_not_found',
		message: {
			en: 'Build not found!',
			fa: 'پروژه یافت نشد!'
		},
		responseCode: 400
	},
	BUILD_ID_REQUIRED: {
		key: 'build_id_required',
		message: {
			en: 'Build id is required!',
			fa: 'شناسه پروژه الزامی است!'
		},
		responseCode: 400
	},
	INCORRECT_PASSWORD: {
		key: 'incorrect_password',
		message: {
			en: 'Password is incorrect!',
			fa: 'رمزعبور اشتباه است.'
		},
		responseCode: 401
	}
}
