from django.core.paginator import Paginator 

#Custom pagination class, initialize with request
#By default, if no page_size or page is provided to the query parameter, all objects are returned
class CustomPagination():
    def __init__(self, context):
        self.context = context
        self.query_params = context['request'].query_params
        self.page_size = self.query_params.get('size')
        self.page = self.query_params.get('page')

    # this function tkaes an object and orders it by order or default 'id'
    def paginate(self, obj, order='id'):
        if self.page_size is None or self.page is None:
            return obj.order_by(order)
        self.pagination = Paginator(obj.order_by(order), self.page_size)
        return self.pagination.page(self.page)    
