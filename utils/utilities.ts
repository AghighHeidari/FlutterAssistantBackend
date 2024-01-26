export function promptify(requirements: any): string {
	return `
	عنوان: ${requirements.title}
	نوع محصولات: ${requirements.title}
	آیتم‌های منو: ${requirements.menuItems}
	رنگ‌ها: ${requirements.colors}
	محصولات:
	${(requirements.products ?? []).map((product: any) => {
		return `نام: ${product.name}
		قیمت: ${product.price}
		`
	})}
	نوع فروشگاه: ${requirements.shopType}
	شماره تماس: ${requirements.phoneNumber}
	ایمیل: ${requirements.email}
	اینستاگرام: ${requirements.instagram}
	تلگرام: ${requirements.telegram}
	`;
}
