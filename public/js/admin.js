const deleteProduct = btn => {
	const productId = btn.parentNode.querySelector('[name=productId]').value;
	const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
	const product = btn.closest('article');
	
	fetch(`/admin/products/${productId}`, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrfToken
		}
	})
	.then(() => product.remove())
	.catch(err => console.log(err));
}