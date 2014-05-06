# http表单输入前缀
quartzService.directive "httpPrefix", ->
	restrict: "A"
	scope: false
	require: "ngModel"
	link: (scope, element, attr, ngModel) ->
		element.bind "change", ->
			if !/^(http):\/\//i.test(ngModel.$viewValue) and ngModel.$viewValue
				ngModel.$setViewValue "http://" + ngModel.$viewValue
				ngModel.$render()