import React from 'react';
import {shallow} from 'enzyme';
import {Provider} from 'mobx-react';
import App from '../app/modules';

describe('<App />', ()=> {
  let store;

  beforeEach(()=> {
    store = {};
  });


  it('should render correctly', ()=> {

    expect(shallow(<Provider store={store}><App/></Provider>).length).toBe(1);

  });

});
