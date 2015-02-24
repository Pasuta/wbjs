(function(){
    var tabs = document.getElementsByClassName('asideHeader')[0].querySelectorAll('div');
    for (var i = 0; i < tabs.length; i++) {
        var obj = tabs[i];
        Event.add(obj, 'click', function(){
            window.location.hash = '#' + this.getAttribute('data-hash');
        });
    }

    window.onhashchange = function(){
        var hash = window.location.hash.substr(1);
        var activeTab = document.getElementsByClassName(hash)[0];
        activeTab.classList.add(hash + 'Active');
        for (var i = 0; i < tabs.length; i++) {
            var obj = tabs[i];
            if (obj != activeTab) obj.classList.remove(obj.getAttribute('data-hash') + 'Active');
        }

        var asideContentTabs = document.getElementsByClassName('asideContent')[0].querySelectorAll('div');
        var asideContentActiveTab = document.getElementsByClassName('asideContent' + hash)[0];
        asideContentActiveTab.style.display = 'block';
        for (var j = 0; j < asideContentTabs.length; j++) {
            var obj2 = asideContentTabs[j];
            if (obj2 != asideContentActiveTab) obj2.style.display = 'none';
        }
    };

})(); // Переключание табов

(function(){
    var settings = document.getElementsByClassName('settings')[0];
    var dropMenu = document.getElementsByClassName('dropMenu')[0];
    Event.add(settings, 'click', function(){
        dropMenu.classList.toggle('hide');
    });
})(); // Шестерня настроек

(function(){
    var adminForm = document.getElementsByClassName('adminForm');
    for (var i = 0; i < adminForm.length; i++) {
        var form = adminForm[i];
        var btn = form.getElementsByClassName('adminBtn')[0];
        Event.add(btn, 'click', sendForm);
    }

    function sendForm(){
        var form = this.parentNode;
        var data = collectFormData(form);
        var action = form.getAttribute('data-action');

        data['table'] = form.getAttribute('data-table');
        data['action'] = form.getAttribute('data-messageaction');

        var redirect = form.getAttribute('data-redirect');

        ajax(action, data).then(
            function(){
                if (redirect) window.location.href = redirect;
            }
        );
    }
})(); // Сабмит любой формы