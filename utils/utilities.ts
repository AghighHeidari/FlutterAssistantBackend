export function promptify(requirements: any): string {
	return `
	عنوان: ${requirements.title}
	نوع محصولات: ${requirements.itemType}
	آیتم‌های منو: ${(requirements.menuItems??[]).join(', ')}
	رنگ‌ها: ${requirements.colors.join(', ')}
	محصولات:
	${(requirements.products ?? []).map((product: any) => {
		return `نام: ${product.name}
		قیمت: ${product.price}`
	}).join('\n')}
	نوع فروشگاه: ${requirements.shopType}
	شماره تماس: ${requirements.phoneNumber}
	ایمیل: ${requirements.email}
	اینستاگرام: ${requirements.instagram}
	تلگرام: ${requirements.telegram}
	`;
}
