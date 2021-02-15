import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { flattenDeep, uniq, first } from 'lodash';

import createWord from '@CREATE/word';
import getKanjis from '@GET/kanjis';
import getWord from '@GET/word';
import Jword from '@models/jword.model';
import Kanji from '@models/kanji.model';
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
    const { word } = ctx.params;
    if (!word.trim()) {
      ctx.body = { error: 'A word is required' };
      ctx.status = 400;

      return;
    }
    ctx.body = await getWord(word);
  } catch (err) {
    ctx.body = { error: err.message };
    ctx.status = 500; // conflict
  }
});

router.get('/kanji/kanji-list', async (ctx) => {
  const allKanjis = await Kanji.find({});
  const wordNames = uniq(allKanjis.map(({ character }) => character));
  ctx.body = wordNames;
});

router.get('/kanji/:kanji?', async (ctx) => {
  // @todo check si c'est un kanji
  try {
    const { kanji } = ctx.params;
    if (!kanji) {
      ctx.body = { error: 'A Kanji is required' };
      ctx.status = 400;
      return;
    }
    if (kanji.replace(/[一-龯々〆〤]/)) {
      ctx.body = { error: `${kanji} is not kanji or is composed of several kanjis` };
      ctx.status = 400;
      return;
    }
    ctx.body = first(await getKanjis([kanji]));
  } catch (err) {
    ctx.body = { error: err.message };
    ctx.status = 500; // conflict
  }
});

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
