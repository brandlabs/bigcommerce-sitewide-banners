import 'whatwg-fetch';

const BANNER_URL = '/sitewide-banners/';

/**
 * First we get the site banners content
 *
 * @returns  {Promise}
 */
function getBannerPageContent() {
    /* eslint no-undef: "off" */
    return fetch(BANNER_URL, { credentials: 'same-origin' })
        .then(page => page.text());
}

/**
 * Takes a DOMElement and inserts on it the contents of the banners Array. Additionally, if the [[location]] is passed, we use it for the
 * `data-banner-location` property
 *
 * @param {DOMElement}          $element
 * @param {Array<DOMElement>}   banners
 * @param {string}              [location='']
 */
function insertBanner($element, banners, location = '') {
    const dataBannerLocation = location === 'top' ?
        '="top"' :
        location === 'bottom' ?
        '="bottom"' :
        '';

    const html = `
        <div class="banners" data-banner-location${ dataBannerLocation }>
            <div class="banner">
                ${ banners.map(banner => banner.outerHTML).join('\n') }
            </div>
        </div>
    `;

    $element.insertAdjacentHTML('beforebegin', html);
}

module.exports = class SiteWideBanners {
    constructor () {
        this.banners = {
            top: [],
            bottom: [],
        };
    }

    /**
     * We get all banners present on the Sitewide Banners Category page and put them in the banners object differentiates by "top" or "bottom" ones
     * for later consuming
     *
     * @returns  {undefined|Promise<Array>}    Since it's an async functions it returns a Promise that resolves to our banners object or undefined id there is no banner information
     * @memberof SiteWideBanners
     */
    async getBanners() {
        const siteWideBannerText = await getBannerPageContent();
        if (!siteWideBannerText) {
            return;     // There is no banner
        }

        const $fragment = document.createElement('div');
        $fragment.innerHTML = siteWideBannerText;

        // We get all top and bottom banners and place them as arrays for later use
        const $topBannerSection = $fragment.querySelector('[data-banner-location="top"] > .banner');
        const $bottomBannerSection = $fragment.querySelector('[data-banner-location="bottom"] > .banner');

        if ($topBannerSection) {
            this.banners.top = Array.from($topBannerSection.children);
        }

        if ($bottomBannerSection) {
            this.banners.bottom = Array.from($bottomBannerSection.children);
        }

        return this.banners;
    }

    /**
     * You can add any banner obtained on any element passed on the [[place]] variable. This argument should be a valid CSS selector.
     * If no [[place]] is provided, we try to place all top banners. If there is no top banners data, we try to place all bottom banners (if there is data).
     * [[banners]] is an Array of DOMElements. It should be the information obtained from the [[getBanners]] method, but can be any DOMElement.
     *
     * @param {Object} [{ place = this.banners.top.length ? 'top' : 'bottom', banners = this.banners.top.length ? this.banners.top : this.banners.bottom }={}] It can be 'top', 'bottom' or any valid CSS selector
     * @returns
     * @memberof SiteWideBanners
     */
    addBanners({ place = this.banners.top.length ? 'top' : 'bottom', banners = this.banners.top.length ? this.banners.top : this.banners.bottom } = {}) {
        let $element = null;

        if (place === 'top') {
            const $currentBanner = document.querySelector('.banners[data-banner-location="top"]');
            if ($currentBanner) {
                return; // we don't want to override an existing banner
            }

            $element = document.querySelector('header.header');
        } else if (place === 'bottom') {
            const $currentBanner = document.querySelector('.banners[data-banner-location="bottom"]');
            if ($currentBanner) {
                return; // we don't want to override an existing banner
            }

            $element = document.querySelector('footer.footer');
        } else if (place) {
            $element = document.querySelector(place);
        }

        if (!$element || !banners || banners.length === 0) {
            return;
        }

        insertBanner($element, banners, place);
    }
}
