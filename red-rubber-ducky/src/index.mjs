import { inference } from './lib/parse/index.mjs';

 addEventListener('fetch', async event => {
     const body = event.request.JSON()
     const result = await inference(body.message)

     return event.respondWith(
             new Response(result, {
                 headers: {
                     'content-type': 'application/json;charset=UTF-8',
                 },
             })
             );
 });
