from django.core.paginator import Paginator 

#Custom pagination class, initialize with request
#By default, if no page_size or page is provided to the query parameter, all objects are returned
class CustomPagination():
    # this function tkaes an object and orders it by order or default 'id'
    def paginate(self, obj, page=None, size=None, order='id', ascending=True):
        if ascending:
            order = order
        else:
            order = '-' + order
        if page is None or size is None:
            return obj.order_by(order)
        pagination = Paginator(obj.order_by(order), size)
        return pagination.page(page)    
