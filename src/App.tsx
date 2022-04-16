import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { StoreContext } from '~/stores/rootStore';
import testApi from 'apis/TestApi';

function App() {
  const store = useContext(StoreContext);
  useEffect(() => {
    testApi['/ip_get']({}).then(res => console.log(res.origin));
    testApi['/delay/:delay_get']({ delay: 2 }).then(res => {
      console.log(res);
    });
    testApi['/delay/:delay_post'](
      { delay: 10 },
      {
        timeoutErrorMessage: 'OH NO!!! TIMEOUT',
      }
    )
      .then(res => {
        console.log(res);
      })
      .catch(err => console.error(err));

    testApi['/base64/:value_get']({ value: 'SFRUUEJJTiBpcyBhd2Vzb21l' }).then(res =>
      console.log(res)
    );
    testApi['/form_post']({ custname: '666' }, { headers: { 7788: '66xx' } }).then(res =>
      console.log(res.data)
    );
    testApi.getLocalStorageValue({ key: 'count' }).then(value => console.log(value));
  }, []);

  return (
    <div>
      {store.countStore.count}
      <button onClick={store.countStore.increase}> + </button>
      <button onClick={store.countStore.descrease}> - </button>
    </div>
  );
}

export default observer(App);
