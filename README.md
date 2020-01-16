# Cookie Consent Component

The Cookie Consent Component (CCC) asks users for permission to store information in their browser.

Many others have made similar components but this one is differenct because it enables the user to retract consent. 
This is an important detail becuse the ability to cancel consent is needed to comply with [Danish cookie law.](https://www.retsinformation.dk/Forms/R0710.aspx?id=212265)

CCC fires a `consentgiven` or `consentdeclined` event when the user either accepts or declines cookie consent. 
You can simply add listeners for these events to control cookie dumping javascript on your website.


## How to deploy cookies and similar technologies legally

*For practical purposes we use the term `cookie` for any technology that stores data on a client device.*
This includes localstorage, InnoDB, cache storage, and the like.

To comply with EU cookie regulations and Danish cookie law in particular, your users must give you a *willing and informed consent* to storing any kind of data on their device. This is what the cookie popup component is here to do.

You do not need to acquire consent to use purely functional cookies.

### Informed consent

To make sure you get *informed* consent from your users, you need to ...
* Present information clearly and visibly
* Include information about WHO will store data (You, Google, etc.)
* Include information about WHAT the stored data is for (Analytics, marketing, etc)
* Include information about HOW LONG the stored data will persist (Cookie expiry date, etc)

### Willing consent

To make sure you get *willing* consent from your users, you need to ...
* Make it equally easy to accept or reject cookies
* Enable users to retract consent


## Deploying to the web

1. Add configuration javascript. Add a global javascript variable named `cookie_consent_config` to every page where the CCC appears. 

A minimal configuration should include an ID string for your CCC and required legal information on the purposes of the stored data.

The script can appear in the _head_ or _body_ section of the page **but it must be executed before cookie-consent.js**
```html
<script>
    // This is a minimal configuration
    var cookie_consent_config = {
        localStorageId: 'mysite-cookie-consent-123456789',
        messages: { 
            purposes: [
                'To enable GlobalFirm(tm) tracking for web analytics',
                'For AddService(tm) to create targeted marketing'
            ],
            additionalInfo: '<a href="www.myssite.com/about-the-cookies">Go here to read the small print.</a>',
        }
    }
</script>
```

2. Add [cookie-consent.js](./dist/cookie-consent.js) to your project files and refer to it from the HTML of every page where the CCC appears. 
Placing it at the end of the *body* section will usually be fine, but might want to put in the *head* section if you need it to execute before something else does.
```
<!DOCTYPE html>
<html>
    <head>
        ...
        <!-- Add script tag to head ... -->
        <script src="./cookie-consent.js">
        ...
    </head>

    <body>
        ...
        <!-- ... Or add script tag to body -->
        <script src="./cookie-consent.js"></script>
        ...
    </body>
</html>
```


3. You can include the default theme by adding [my-cc-theme.css](./dist/my-cc-theme.css). Or skip it and build your own styles to match with your site style.
```html
<!DOCTYPE html>
<html>
    <head>
        ...
        <link rel='stylesheet' href='/somepath/my-cc-theme.css'>
        ...
    </head>
    ...
</html>
```

4. Update your site's javascripts to only save data locally on the `consentgiven` event. An easy way to do it is wrapping any javascript that uses cookies/localstorage/etc. in an event listener like so:
```javascript
document.addEventListener('consentgiven', function() {
    // Execute your scripts now
})
```
Remember to also listen for `consentdeclined` events for when users decline or revoke consent:
```javascript
document.addEventListener('consentdeclined', function() {
    // Stop scripts from saving data and clean up existing cookies/localstorage/etc.
})
```


### CCC configuration

Here is an overview of all the configurations possible using `cookie_consent_config`
*Note that all default text labels are written in Danish.*

```javascript
var cookie_consent_config = {

    /* 
     * MANDATORY:
     * localStorageId is the unique identifier for your entire website. The ensures that other sites using the same CCC don't accidently use the same user preferences as yours.
     */
    localStorageId: 'my-cookie-consent-0987654321',

    /* 
     * messages include all the configurable text strings
     */
    messages: { 

        /* 
         * MANDATORY:
         * purposes is an array of strings. 
         * Each string should detail:
         *   WHO is storing data
         *   WHAT purpose the stored data is for
         *   HOW LONG the data will be stored (cookie expiry date)
         */
        purposes: [
            'Så Giant Corp(tm) kan lave analyse på webtrafik og andre ting, som vi faktisk ikke helt har styr på. Giant Corp(tm) cookie udløber 31-12-2020',
            'Så Faceless(tm) kan samle data og give dig målrettede reklamer. Faceless(tm) localstorage data forbliver indtil du rydder din cache.'
        ],

        /* 
         * MANDATORY:
         * additionalInfo should include a link to your cookie policy
         */
        additionalInfo: 'Her bør der være et <a href="#">link til yderligere information.</a>',

        /* 
         * OPTIONAL:
         * title that appears in CCC dialog
         */
        title: 'Samtykke til brug af cookies',

        /* 
         * OPTIONAL:
         * Introduction text that appears before the list of purposes in the CCC dialog
         */
        introduction: 'Vi vil gerne gemme cookies i din browser til følgende formål:',

        /* 
         * OPTIONAL:
         * Label for the button to accept cookies
         */
        acceptButtonTxt: 'Ja tak',

        /* 
         * OPTIONAL:
         * Label for the button to decline cookies
         */
        declineButtonTxt: 'Nej tak',

        /* 
         * OPTIONAL:
         * Status label for when user has accepted cookies
         */
        acceptedTxt: 'accepteret',

        /* 
         * OPTIONAL:
         * Status label for when user has declined cookies
         */
        declinedTxt: 'afvist',

        /* 
         * OPTIONAL:
         * Label for the toggle to display the secondary dialog where user can revoke or confirm consent
         */
        editConsent: 'Redigér samtykke',

        /* 
         * OPTIONAL:
         * Title the the secondary dialog when user has declined cookies
         */
        revisionTitleDeclined: 'Øv! Du har ikke givet samtykke til cookies',

        /* 
         * OPTIONAL:
         * Text in the secondary dialog to present the option of accepting cookies
         */
        revisionAskToAccept: 'Vil du give samtykke til brug af cookies?',

        /* 
         * OPTIONAL:
         * Title the the secondary dialog when user has accepted cookies
         */
        revisionTitleAccepted: 'Hurra! Du har givet samtykke til cookies',

        /* 
         * OPTIONAL:
         * Text in the secondary dialog to present the option of declining cookies
         */
        revisionAskToDecline: 'Har du fortrudt?',

        /* 
         * OPTIONAL:
         * Label for the button to revoke cookie consent
         */
        revisionDeclineAction: 'Træk mit samtykke tilbage',

        /* 
         * OPTIONAL:
         * Label for the button to close the secondary dialog
         */        
        revisionCloseDiag: 'Luk dialogboks'
    }
}
```

## Develop your own Cookie Consent

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

Install the dependencies...

```bash
cd cookie-consent
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Making a production build

To create an optimised version of the app for production deployment:

```bash
npm run build
```

You can run the newly built app with `npm run start`.
