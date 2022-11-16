from django.core.paginator import Paginator 

#Custom pagination class, initialize with request
#By default, if no page_size or page is provided to the query parameter, all objects are returned
class CustomPagination():
    def __init__(self, context):
        self.context = context
        self.query_params = self.context['request'].query_params
        self.setup()

    def setup(self):
        # initialize and setup page size and page
        try:
            page_size = self.query_params.get('size')
            page = self.query_params.get('page')
            self.page_size = page_size
            self.page = page
        except:
            return


    # this function tkaes an object and orders it by order or default 'id'
    def paginate(self, obj, order='id'):
        if self.page_size is None or self.page is None:
            return obj.order_by(order)
        self.pagination = Paginator(obj.order_by(order), self.page_size)
        return self.pagination.page(self.page)    
