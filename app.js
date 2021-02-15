import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { flattenDeep, uniq } from 'lodash';

import createWord from '@CREATE/word';
// import getKaExamplesByIds from '@GET/get-ka-examples-by-ids';
// import getWordNameList from '@GET/get-word-name-list';
// import getKanji from '@GET/kanji';
// import getKanjis from '@GET/kanjis';
import getWord from '@GET/word';
import Jword from '@models/jword.model';
import connect from '@mongo/connect';
import { getEnv, filterEmpty } from '@utils';

const app = new Koa();
const router = new Router();

connect(getEnv('DB_NAME'));

router.get('/word/word-name-list', async (ctx) => {
  const allWords = await Jword.find({});
  const wordNames = uniq(
    flattenDeep(allWords.map(({ reading, word }) => filterEmpty([reading, word]))),
  );
  ctx.body = wordNames;
});

router.get('/word/:word?', async (ctx) => {
  try {
    ctx.body = await getWord(ctx.params.word);
  } catch (err) {
    ctx.body = { error: err.message };
    ctx.status = 500; // conflict
  }
});

// router.get('/kanji/kanji-list', async (ctx) => {
//   // todo: fix multiple occurences
//   ctx.body = uniq((await getKanjis()).map(({ character }) => character));
// });

// router.get('/kanji/:kanji-by-ids', async (ctx) => {
//   const { ids } = ctx.query;
//   ctx.body = await getKanjis(isArray(ids) ? ids : [ids]);
// });

// router.get('/kanji/:kanji?', async (ctx) => {
//   // @todo check si c'est un kanji
//   ctx.body = await getKanji(ctx.params.kanji);
// });
// router.get('/examples', async (ctx) => {
//   const { ids } = ctx.query;
//   ctx.body = await getKaExamplesByIds(isArray(ids) ? ids : [ids]);
// });
router.put('/word', koaBody(), async (ctx) => {
  try {
    const word = ctx?.request?.body?.word;
    ctx.body = await createWord(word);
  } catch (err) {
    ctx.body = { error: err.message };
    ctx.status = 409; // conflict
  }
});

app.use(router.routes());

export default app;
