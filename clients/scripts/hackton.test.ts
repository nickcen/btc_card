import shell from 'shelljs';
import { _SERVICE as ProviderService } from '../idls/card_provider';
import { idlFactory as ProviderIdlFactory } from '../idls/card_provider.idl';

import { _SERVICE as ControllerService } from '../idls/card_controller';
import { idlFactory as ControllerIdlFactory } from '../idls/card_controller.idl';

import { getCanisterId, getActor, identity, hasOwnProperty, isProduction, principalToAccountIdentifier, toHexString } from '@ego-js/utils';


describe('create_controller', () => {
  it('controller_main_create', async () => {
    const provider = await getActor<ProviderService>(identity(), ProviderIdlFactory, getCanisterId("card_provider")!);;
    let resp1 = await provider.controller_main_create({
      name: "hackton",
      sub_domain: "btc.lite",
      chain: {BTC: null},
      canister_app_name: "btc_wallet",
      mint_type: { CREATED: null },
    });

    console.log('controller id: ' + resp1.id);
  });
});

describe('controller operation', () => {
  it('premint', async () => {
    let controllerActor = await getActor<ControllerService>(identity(), ControllerIdlFactory, getCanisterId("card_controller")!);

    const resp1 = await controllerActor.contract_premint({
      card_number: "000001",
      card_code: "111111",
      active_code: "1234",
    });

    console.log(resp1)

    const resp2 = await controllerActor.contract_premint({
      card_number: "000002",
      card_code: "222222",
      active_code: "1234",
    });

    console.log(resp2)
  });

  it('contract_list_all', async () => {
    let controllerActor = await getActor<ControllerService>(identity(), ControllerIdlFactory, getCanisterId("card_controller")!);
    let results = await controllerActor.contract_list_all();
    results['Ok'].forEach(contract => {
      console.log(contract)
      console.log(contract['eoa_address'])
    })

  })

  it.skip('contract_change_active_code', async () => {
    let controllerActor = await getActor<ControllerService>(identity(), ControllerIdlFactory, getCanisterId("card_controller")!);
    let results = await controllerActor.contract_change_active_code('222222', '1234');
    console.log(results)

  })

  it('deactivate', async () => {
    let controllerActor = await getActor<ControllerService>(identity(), ControllerIdlFactory, getCanisterId("card_controller")!);
    let results = await controllerActor.deactivate({'card_code': '222222'});
    console.log(results)
  })

  it.skip('mint_exist', async () => {
    let controllerActor = await getActor<ControllerService>(identity(), ControllerIdlFactory, getCanisterId("card_controller")!);
    let results = await controllerActor.mint_exist({'card_code': '222222'});
    console.log(results)
  })

})
