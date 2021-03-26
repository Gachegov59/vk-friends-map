/*eslint-disable */
import {auth, vkAPI} from './vk.js'
import {customItemContentLayout} from './template.js'

document.addEventListener('DOMContentLoaded', () => {

    let myMap
    let clusterer
    let btn = document.querySelector('.load-vk')

    ymaps.ready(async () => {

        btn.addEventListener('click', connectVk)

        const cache = new Map();

        myMap = new ymaps.Map('map', {
            center: [58.01, 56.23],
            zoom: 8,
            controls: ['smallMapDefaultSet'],
        }, {searchControlProvider: 'yandex#search'});
        clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
        })

        async function connectVk() {
            await auth()
            const [me] = await vkAPI('users.get', {fields: 'city, country'})
            const friends = await vkAPI('friends.get', {fields: 'city,relation,domain, country,bdate, domain, online, photo_100, photo_200'})

            friends.items.push(me)
            myMap.geoObjects.add(clusterer)

            function geocode(address) {
                if (cache.has(address)) {
                    return cache.get(address)
                }

                const geocodePromise = ymaps.geocode(address)
                    .then(result => {
                        const points = result.geoObjects.toArray();

                        if (points.length) {
                            return points[0].geometry.getCoordinates();
                        }
                    })
                cache.set(address, geocodePromise)

                return cache.get(address)
            }

            friends.items
                .filter(friend => friend.first_name !== 'DELETED' && friend.country && friend.country.title)
                .map(friend => {
                    let friendInfo = {
                        name: friend.first_name,
                        lastName: friend.last_name,
                        photo: friend.photo_100,
                        photoBig: friend.photo_200,
                        online: friend.online,
                        domain: friend.domain,
                    }

                    let place = friend.country.title
                    if (friend.city) {
                        place += ' ' + friend.city.title
                    }
                    return {place, friendInfo}
                })
                .map(async friendObj => {
                    const coord = await geocode(friendObj.place)
                    const placemark = new ymaps.Placemark(coord, {
                        friendInfo: friendObj.friendInfo,
                        hintContent:
                            `<a href="https://vk.com/${friendObj.friendInfo.domain}" target="_blank">` +
                            `<div class='a_name'>${friendObj.friendInfo.name}</div> ` +
                            `<div style="margin-bottom: 5px" class='a_name'>${friendObj.friendInfo.lastName}</div> ` +
                            '</a>' +
                            `<div class="ava ${friendObj.friendInfo.photo}">` +
                            `<div class='${friendObj.friendInfo.online ? 'ava online' : 'ava'}'>` +
                            `<img class=ballon_body src="${friendObj.friendInfo.photo}">` +
                            '</div>' +
                            '</div>'
                    }, {preset: 'islands#blueHomeCircleIcon'})
                    clusterer.add(placemark)
                    myMap.setBounds(clusterer.getBounds());
                })
        }
    })

})



