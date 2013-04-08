var module1 = angular.module('todoService', ['ngResource']).factory('Todo', ['$resource', function ($resource) {
    var Todo = $resource('/api/todo/:todoId', {}, {
        update: { method: 'PUT'}
    });
    return Todo;
}]);