from django.core.paginator import Paginator 

#Custom pagination class, initialize with request to customize size and page
class CustomPagination():
    def __init__(self, context):
        self.context = context
        self.page_size = 5
        self.page = 1
        self.setup()

    def setup(self):
        try:
            self.page_size = self.context['request'].query_params.get('size')
            self.page = self.context['request'].query_params.get('page')
        except:
            return

    # this function tkaes an object and orders it by order or default 'id'
    def paginate(self, obj, order='id'):
        pagination = Paginator(obj.order_by(order), self.page_size)
        return pagination.page(self.page)
        

        


    

