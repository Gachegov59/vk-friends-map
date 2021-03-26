export let customItemContentLayout

ymaps.ready(async () => {

      customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="wrapper">' +
        '<h2 class=ballon_header>{{ properties.friendInfo.name}} {{ properties.friendInfo.lastName }}</h2>' +
        '<a href="https://vk.com/{{ properties.friendInfo.domain }}" target="_blank">Страница</a>' +
        '</div>' +
        '{% if properties.friendInfo.online %}' +
        '<div class="ava online">' +
        '<img class=ballon_body src="{{ properties.friendInfo.photo }}">' +
        '{% else %}' +
        '<div class="ava">' +
        '<img class=ballon_body src="{{ properties.friendInfo.photo }}">' +
        '</div>' +
        '{% endif %}'
    );
})

