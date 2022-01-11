import {
  queryAccounttx,
  queryMiner
} from '@/services/home';

export default {
  namespace: 'home',
  state: {
    
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // history.listen(({ pathname }) => {
      //   if (pathname === '/deploy') {
      //     dispatch({ type: 'getControlCircleWithOrganizationAndNotDeploy' });
      //     dispatch({ type: 'getCheckpointList' });
      //     dispatch({ type: 'getPoliceboxList' });
      //     dispatch({ type: 'getDoorwayList' });
      //     dispatch({ type: 'getControlTopicList' });
      //   }
      // });
    },
  },
  effects: {
    *queryAccounttx({payload}, { call, put }) {
      return yield call(queryAccounttx,payload);
    },
    *queryMiner(_, { call, put }) {
      return yield call(queryMiner);
    }
    
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};
