// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    desktop: true,
    version: '0.0.1',
    qlcChainNetwork: 'main', // test or main
    rpcUrl: {
        'test': 'http://47.103.54.171:29735',
        'main': 'https://rpc.qlcchain.online'
    },
    wsUrl: {
        'test': '',
        'main': 'wss://rpc-ws.qlcchain.online'
    },
    chain: {
        fee: '500000000'
    }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


// 'test': 'http://47.103.54.171:29734',
//     'test2': 'http://47.103.54.171:29735',
//     'test3': 'http://47.103.54.171:29736',
//     'test4': 'http://47.103.97.9:29734',
//     'test5': 'http://47.103.97.9:29735',
//     'test6': 'http://47.103.97.9:29736',
//     'test7': 'https://47.103.54.171:29734',
//     'test8': 'https://47.103.54.171:29735',
//     'test9': 'https://47.103.54.171:29736',
//     'test10': 'https://47.103.97.9:29734',
//     'test11': 'https://47.103.97.9:29735',
//     'test12': 'https://47.103.97.9:29736',
