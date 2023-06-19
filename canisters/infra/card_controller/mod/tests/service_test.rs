use async_trait::async_trait;
use ego_lib::{inject_mock_ego_canister, inject_mock_ego_store};
use ego_lib::ego_canister::TEgoCanister;
use ego_lib::ego_store::TEgoStore;
use ego_types::app::*;
use ego_types::app_info::AppInfo;
use ic_cdk::export::Principal;
use mockall::mock;

use card_controller_mod::contract::{Contract, ContractStatus};
use card_controller_mod::contract::ContractStatus::NEW;
use card_controller_mod::rpc::airdrop_canister::TAirdropCanister;
use card_controller_mod::rpc::btc_wallet::TBTCWallet;
use card_controller_mod::service::Service;
use card_controller_mod::state::{CONTROLLER, REGISTRY};
use types::types::ChainType;
use types::types::MintType::{ACTIVATED, CREATED};

static FACTORY_ID: &str = "22ayq-aiaaa-aaaai-qgmma-cai";

static CANISTER_1: &str = "225da-yaaaa-aaaah-qahrq-cai";
static ADDRESS_1: &str = "address_1";
static CARD_CODE_1: &str = "code1";
static CARD_NUMBER_1: &str = "000001";
static ACTIVE_CODE_1: &str = "active1";

static CANISTER_2: &str = "223vg-sqaaa-aaaak-abtmq-cai";
static ADDRESS_2: &str = "address_2";
static CARD_CODE_2: &str = "code2";
static CARD_NUMBER_2: &str = "000002";
static ACTIVE_CODE_2: &str = "active2";

static CANISTER_3: &str = "227wz-liaaa-aaaaa-qaara-cai";
static ADDRESS_3: &str = "address_3";
static CARD_CODE_3: &str = "code3";
static CARD_NUMBER_3: &str = "000003";
static ACTIVE_CODE_3: &str = "active3";

static USER_ADDRESS: &str = "amybd-zyaaa-aaaah-qc4hq-cai";
static USER_EMAIL: &str = "user@email";

static CANISTER_APP_NAME: &str = "btc_wallet";

static AIRDROP_CANISTER: &str = "nq4qv-wqaaa-aaaaf-bhdgq-cai";

mock! {
  Card {}

  #[async_trait]
  impl TBTCWallet for Card {
    async fn wallet_eoa_address_get(&self, target_canister_id: Principal) -> Result<String, String>;

    async fn wallet_segwit_address_get(&self, target_canister_id: Principal)
                                     -> Result<String, String>;
  }
}

mock! {
  Airdrop {}

  #[async_trait]
  impl TAirdropCanister for Airdrop {
    fn airdrop_from_controller(&self, target_canister_id: Principal, astro_card_id: Principal);
  }
}

inject_mock_ego_canister!();
inject_mock_ego_store!();

fn set_up_activated_case() {
  CONTROLLER.with(|controller| {
    controller.borrow_mut().contracts.clear();

    // contract 1 for activated active mode
    controller
      .borrow_mut()
      .contracts
      .entry(CARD_CODE_1.to_string())
      .or_insert(Contract {
        card_number: CARD_NUMBER_1.to_string(),
        contract_address: Principal::anonymous(),
        eoa_address: Some(ADDRESS_1.to_string()),
        active_code: ACTIVE_CODE_1.to_string(),
        user_address: None,
        email: None,
        status: NEW,
        card_code: CARD_CODE_1.to_string(),
      });

    controller
      .borrow_mut()
      .contracts
      .entry(CARD_CODE_3.to_string())
      .or_insert(Contract {
        card_number: CARD_NUMBER_3.to_string(),
        contract_address: Principal::from_text(CANISTER_3.to_string()).unwrap(),
        eoa_address: Some(ADDRESS_3.to_string()),
        active_code: ACTIVE_CODE_3.to_string(),
        user_address: Some(Principal::from_text(USER_ADDRESS.to_string()).unwrap()),
        email: Some("user3@astro.com".to_string()),
        status: ContractStatus::ACTIVATED,
        card_code: CARD_CODE_3.to_string(),
      });
  });

  REGISTRY.with(|register| register.borrow_mut().canister_remove_all("airdrop_canister".to_string()));
}

fn set_up_created_case() {
  CONTROLLER.with(|controller| {
    controller.borrow_mut().contracts.clear();

    // contract 1 for activated active mode
    controller
      .borrow_mut()
      .contracts
      .entry(CARD_CODE_1.to_string())
      .or_insert(Contract {
        card_number: CARD_NUMBER_1.to_string(),
        contract_address: Principal::from_text(CANISTER_1.to_string()).unwrap(),
        eoa_address: Some(ADDRESS_1.to_string()),
        active_code: ACTIVE_CODE_1.to_string(),
        user_address: None,
        email: None,
        status: NEW,
        card_code: CARD_CODE_1.to_string(),
      });

    controller
      .borrow_mut()
      .contracts
      .entry(CARD_CODE_3.to_string())
      .or_insert(Contract {
        card_number: CARD_NUMBER_3.to_string(),
        contract_address: Principal::from_text(CANISTER_3.to_string()).unwrap(),
        eoa_address: Some(ADDRESS_3.to_string()),
        active_code: ACTIVE_CODE_3.to_string(),
        user_address: Some(Principal::from_text(USER_ADDRESS.to_string()).unwrap()),
        email: Some("user3@astro.com".to_string()),
        status: ContractStatus::ACTIVATED,
        card_code: CARD_CODE_3.to_string(),
      });
  });

  REGISTRY.with(|register| register.borrow_mut().canister_remove_all("airdrop_canister".to_string()));
}

#[tokio::test]
async fn premint_ic_created() {
  set_up_created_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::IC;
    controller.borrow_mut().mint_type = CREATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let mut store = MockStore::new();
  let card = MockCard::new();

  store
    .expect_wallet_app_install()
    .times(1)
    .returning(|app_id| {
      assert_eq!("btc_wallet".to_string(), app_id);
      Ok(UserApp {
        app: App {
          app_id: "btc_wallet".to_string(),
          name: "btc_wallet".to_string(),
          category: Category::System,
          logo: "".to_string(),
          description: "".to_string(),
          current_version: Default::default(),
          price: 0.0,
          app_hash: "".to_string(),
        },
        canister: Canister {
          canister_id: Principal::from_text(CANISTER_2.to_string()).unwrap(),
          canister_type: CanisterType::BACKEND,
        },
        latest_version: Default::default(),
      })
    });

  let _result = Service::premint(
    &store,
    &card,
    CARD_NUMBER_2.to_string(),
    CARD_CODE_2.to_string(),
    ACTIVE_CODE_2.to_string(),
  )
    .await;

  CONTROLLER.with(|controller| {
    assert_eq!(3, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_2) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert!(contract.eoa_address.is_none());
        assert_eq!(CARD_CODE_2, contract.card_code);
        assert_eq!(ACTIVE_CODE_2, contract.active_code);
        assert_eq!(NEW, contract.status);
        assert!(contract.email.is_none());
      }
    }
  });
}

#[tokio::test]
async fn premint_eth_created() {
  set_up_created_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::ETH;
    controller.borrow_mut().mint_type = CREATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let mut store = MockStore::new();
  let mut card = MockCard::new();

  store
    .expect_wallet_app_install()
    .times(1)
    .returning(|app_id| {
      assert_eq!("btc_wallet".to_string(), app_id);
      Ok(UserApp {
        app: App {
          app_id: "btc_wallet".to_string(),
          name: "btc_wallet".to_string(),
          category: Category::System,
          logo: "".to_string(),
          description: "".to_string(),
          current_version: Default::default(),
          price: 0.0,
          app_hash: "".to_string(),
        },
        canister: Canister {
          canister_id: Principal::from_text(CANISTER_2.to_string()).unwrap(),
          canister_type: CanisterType::BACKEND,
        },
        latest_version: Default::default(),
      })
    });

  card.expect_wallet_eoa_address_get()
    .times(1)
    .returning(|target_canister_id| {
      assert_eq!(
        Principal::from_text(CANISTER_2.to_string()).unwrap(),
        target_canister_id
      );
      Ok(ADDRESS_2.to_string())
    });

  let _result = Service::premint(
    &store,
    &card,
    CARD_NUMBER_2.to_string(),
    CARD_CODE_2.to_string(),
    ACTIVE_CODE_2.to_string(),
  )
    .await;

  CONTROLLER.with(|controller| {
    assert_eq!(3, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_2) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert_eq!(ADDRESS_2.to_string(), contract.eoa_address.clone().unwrap());
        assert_eq!(CARD_CODE_2, contract.card_code);
        assert_eq!(ACTIVE_CODE_2, contract.active_code);
        assert_eq!(NEW, contract.status);
        assert!(contract.email.is_none());
      }
    }
  });
}

#[tokio::test]
async fn premint_btc_created() {
  set_up_created_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::BTC;
    controller.borrow_mut().mint_type = CREATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let mut store = MockStore::new();
  let mut card = MockCard::new();

  store
    .expect_wallet_app_install()
    .times(1)
    .returning(|app_id| {
      assert_eq!("btc_wallet".to_string(), app_id);
      Ok(UserApp {
        app: App {
          app_id: "btc_wallet".to_string(),
          name: "btc_wallet".to_string(),
          category: Category::System,
          logo: "".to_string(),
          description: "".to_string(),
          current_version: Default::default(),
          price: 0.0,
          app_hash: "".to_string(),
        },
        canister: Canister {
          canister_id: Principal::from_text(CANISTER_2.to_string()).unwrap(),
          canister_type: CanisterType::BACKEND,
        },
        latest_version: Default::default(),
      })
    });

  card.expect_wallet_segwit_address_get()
    .times(1)
    .returning(|target_canister_id| {
      assert_eq!(
        Principal::from_text(CANISTER_2.to_string()).unwrap(),
        target_canister_id
      );
      Ok(ADDRESS_2.to_string())
    });

  let _result = Service::premint(
    &store,
    &card,
    CARD_NUMBER_2.to_string(),
    CARD_CODE_2.to_string(),
    ACTIVE_CODE_2.to_string(),
  )
    .await;

  CONTROLLER.with(|controller| {
    assert_eq!(3, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_2) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert_eq!(ADDRESS_2.to_string(), contract.eoa_address.clone().unwrap());
        assert_eq!(CARD_CODE_2, contract.card_code);
        assert_eq!(ACTIVE_CODE_2, contract.active_code);
        assert_eq!(NEW, contract.status);
        assert!(contract.email.is_none());
      }
    }
  });
}


#[tokio::test]
async fn premint_ic_activated() {
  set_up_activated_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::IC;
    controller.borrow_mut().mint_type = ACTIVATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let store = MockStore::new();
  let card = MockCard::new();

  let _result = Service::premint(&store, &card, CARD_NUMBER_2.to_string(), CARD_CODE_2.to_string(), ACTIVE_CODE_2.to_string()).await;

  CONTROLLER.with(|controller| {
    assert_eq!(3, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_2) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert!(contract.eoa_address.is_none());
        assert_eq!(CARD_CODE_2, contract.card_code);
        assert_eq!(ACTIVE_CODE_2, contract.active_code);
        assert_eq!(NEW, contract.status);
        assert!(contract.email.is_none());
      }
    }
  });
}

#[tokio::test]
async fn premint_eth_activated() {
  set_up_activated_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::ETH;
    controller.borrow_mut().mint_type = ACTIVATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let store = MockStore::new();
  let card = MockCard::new();

  let _result = Service::premint(&store, &card, CARD_NUMBER_2.to_string(), CARD_CODE_2.to_string(), ACTIVE_CODE_2.to_string()).await;

  CONTROLLER.with(|controller| {
    assert_eq!(3, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_2) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert!(contract.eoa_address.is_none());
        assert_eq!(CARD_CODE_2, contract.card_code);
        assert_eq!(ACTIVE_CODE_2, contract.active_code);
        assert_eq!(NEW, contract.status);
        assert!(contract.email.is_none());
      }
    }
  });
}

#[tokio::test]
async fn active_eth_activated() {
  set_up_activated_case();

  let controller_id = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::ETH;
    controller.borrow_mut().mint_type = ACTIVATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let mut store = MockStore::new();
  let mut card = MockCard::new();
  let mut ego_canister = MockCanister::new();
  let airdrop = MockAirdrop::new();

  store.expect_wallet_app_install().times(1).returning(|app_id| {
    assert_eq!("btc_wallet".to_string(), app_id);
    Ok(UserApp {
      app: App {
        app_id: "btc_wallet".to_string(),
        name: "btc_wallet".to_string(),
        category: Category::System,
        logo: "".to_string(),
        description: "".to_string(),
        current_version: Default::default(),
        price: 0.0,
        app_hash: "".to_string(),
      },
      canister: Canister { canister_id: Principal::from_text(CANISTER_1.to_string()).unwrap(), canister_type: CanisterType::BACKEND },
      latest_version: Default::default(),
    })
  });

  card.expect_wallet_eoa_address_get().times(1).returning(|target_canister_id| {
    assert_eq!(Principal::from_text(CANISTER_1.to_string()).unwrap(), target_canister_id);
    Ok(CANISTER_1.to_string())
  });

  ego_canister.expect_ego_controller_add().times(1).returning(|contract_address, user_address| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(user_address, Principal::from_text(USER_ADDRESS.to_string()).unwrap());
  });

  ego_canister.expect_ego_controller_remove().times(1).returning(|contract_address, user_address| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(user_address, Principal::from_text(FACTORY_ID.to_string()).unwrap());
  });

  ego_canister.expect_ego_owner_set().times(1).returning(|contract_address, owners| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(owners, [Principal::from_text(USER_ADDRESS.to_string()).unwrap()]);
  });

  let _result = Service::active(&store, &card, &ego_canister, &airdrop, CARD_CODE_1.to_string(), ACTIVE_CODE_1.to_string(), user_address, USER_EMAIL.to_string(), controller_id).await;

  CONTROLLER.with(|controller| {
    assert_eq!(2, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_1) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert_eq!(CANISTER_1.to_string(), contract.eoa_address.clone().unwrap());
        assert_eq!(CARD_CODE_1, contract.card_code);
        assert_eq!(ACTIVE_CODE_1, contract.active_code);
        assert_eq!(ContractStatus::ACTIVATED, contract.status);
        assert_eq!(USER_EMAIL.to_string(), contract.email.clone().unwrap());
      }
    }
  });
}

#[tokio::test]
async fn active_eth_activated_with_airdrop() {
  set_up_activated_case();

  let controller_id = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::ETH;
    controller.borrow_mut().mint_type = ACTIVATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  REGISTRY.with(|registry| {
    registry.borrow_mut().canister_add("airdrop_canister".to_string(), Principal::from_text(AIRDROP_CANISTER.to_string()).unwrap());
  });

  let mut store = MockStore::new();
  let mut card = MockCard::new();
  let mut ego_canister = MockCanister::new();
  let mut airdrop = MockAirdrop::new();

  store.expect_wallet_app_install().times(1).returning(|app_id| {
    assert_eq!("btc_wallet".to_string(), app_id);
    Ok(UserApp {
      app: App {
        app_id: "btc_wallet".to_string(),
        name: "btc_wallet".to_string(),
        category: Category::System,
        logo: "".to_string(),
        description: "".to_string(),
        current_version: Default::default(),
        price: 0.0,
        app_hash: "".to_string(),
      },
      canister: Canister { canister_id: Principal::from_text(CANISTER_1.to_string()).unwrap(), canister_type: CanisterType::BACKEND },
      latest_version: Default::default(),
    })
  });

  card.expect_wallet_eoa_address_get().times(1).returning(|target_canister_id| {
    assert_eq!(Principal::from_text(CANISTER_1.to_string()).unwrap(), target_canister_id);
    Ok(CANISTER_1.to_string())
  });

  ego_canister.expect_ego_controller_add().times(1).returning(|contract_address, user_address| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(user_address, Principal::from_text(USER_ADDRESS.to_string()).unwrap());
  });

  ego_canister.expect_ego_controller_remove().times(1).returning(|contract_address, user_address| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(user_address, Principal::from_text(FACTORY_ID.to_string()).unwrap());
  });

  ego_canister.expect_ego_owner_set().times(1).returning(|contract_address, owners| {
    assert_eq!(contract_address, Principal::from_text(CANISTER_1.to_string()).unwrap());
    assert_eq!(owners, [Principal::from_text(USER_ADDRESS.to_string()).unwrap()]);
  });

  airdrop.expect_airdrop_from_controller().times(1).returning(|target_canister_id, astro_card_id| {
    assert_eq!(target_canister_id, Principal::from_text(AIRDROP_CANISTER.to_string()).unwrap());
    assert_eq!(astro_card_id, Principal::from_text(CANISTER_1.to_string()).unwrap());
  });

  let _result = Service::active(&store, &card, &ego_canister, &airdrop, CARD_CODE_1.to_string(), ACTIVE_CODE_1.to_string(), user_address, USER_EMAIL.to_string(), controller_id).await;

  CONTROLLER.with(|controller| {
    assert_eq!(2, controller.borrow().contracts.len());

    match controller.borrow().contracts.get(CARD_CODE_1) {
      None => {
        panic!("no contract deploy");
      }
      Some(contract) => {
        assert_eq!(CANISTER_1.to_string(), contract.eoa_address.clone().unwrap());
        assert_eq!(CARD_CODE_1, contract.card_code);
        assert_eq!(ACTIVE_CODE_1, contract.active_code);
        assert_eq!(ContractStatus::ACTIVATED, contract.status);
        assert_eq!(USER_EMAIL.to_string(), contract.email.clone().unwrap());
      }
    }
  });
}


#[test]
fn contract_list() {
  set_up_activated_case();

  let contracts = Service::contract_list(ContractStatus::NEW);
  assert_eq!(1, contracts.len());

  let contract = contracts.get(0).unwrap();
  assert_eq!(ADDRESS_1, contract.eoa_address.clone().unwrap());
  assert_eq!(CARD_CODE_1, contract.card_code);
  assert_eq!(ACTIVE_CODE_1, contract.active_code);
  assert_eq!(None, contract.email);
}

#[test]
fn contract_edit() {
  set_up_activated_case();

  let mut contract = Service::get_contract(CARD_CODE_1.to_string()).unwrap();
  assert_eq!(contract.active_code, ACTIVE_CODE_1);

  let _ = Service::contract_change_active_code(CARD_CODE_1.to_string(), "TTTT".to_string());

  contract = Service::get_contract(CARD_CODE_1.to_string()).unwrap();
  assert_eq!(contract.active_code, "TTTT");
}

#[tokio::test]
async fn active_created() {
  set_up_created_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::IC;
    controller.borrow_mut().mint_type = CREATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let factory_address = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let mut canister = MockCanister::new();
  let airdrop = MockAirdrop::new();

  canister
    .expect_ego_controller_add()
    .times(1)
    .returning(|target_canister_id, user_address| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        Principal::from_text(USER_ADDRESS.to_string()).unwrap(),
        user_address
      );
    });

  canister.expect_ego_controller_remove().times(1).returning(
    |target_canister_id, factory_address| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        Principal::from_text(FACTORY_ID.to_string()).unwrap(),
        factory_address
      );
    },
  );

  canister
    .expect_ego_owner_set()
    .times(1)
    .returning(|target_canister_id, owners| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        vec![Principal::from_text(USER_ADDRESS.to_string()).unwrap()],
        owners
      );
    });

  let contracts = Service::contract_list(NEW);
  assert_eq!(1, contracts.len());

  let contract = contracts.get(0).unwrap();

  assert_eq!(ADDRESS_1, contract.eoa_address.clone().unwrap());
  assert_eq!(CARD_CODE_1, contract.card_code);
  assert_eq!(ACTIVE_CODE_1, contract.active_code);
  assert_eq!(NEW, contract.status);
  assert_eq!(None, contract.email);

  let store = MockStore::new();
  let card = MockCard::new();

  match Service::active(
    &store,
    &card,
    &canister,
    &airdrop,
    CARD_CODE_1.to_string(),
    ACTIVE_CODE_1.to_string(),
    user_address,
    USER_EMAIL.to_string(),
    factory_address,
  )
    .await
  {
    Ok(_) => {
      let contracts = Service::contract_list(ContractStatus::ACTIVATED);
      assert_eq!(2, contracts.len());

      let contract = contracts
        .iter()
        .find(|contract| contract.card_code == CARD_CODE_1)
        .unwrap();
      assert_eq!(ADDRESS_1, contract.eoa_address.clone().unwrap());
      assert_eq!(CARD_CODE_1, contract.card_code);
      assert_eq!(ACTIVE_CODE_1, contract.active_code);
      assert_eq!(ContractStatus::ACTIVATED, contract.status);
      assert_eq!(Some(USER_EMAIL.to_string()), contract.email);
      assert_eq!(Some(user_address), contract.user_address);
    }
    Err(e) => {
      println!("error is {:?}", e);
      panic!("active failed")
    }
  }
}

#[tokio::test]
async fn active_activated() {
  set_up_activated_case();

  CONTROLLER.with(|controller| {
    controller.borrow_mut().chain = ChainType::IC;
    controller.borrow_mut().mint_type = ACTIVATED;
    controller.borrow_mut().canister_app_name = CANISTER_APP_NAME.to_string();

    assert_eq!(2, controller.borrow().contracts.len());
  });

  let factory_address = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let mut canister = MockCanister::new();
  let airdrop = MockAirdrop::new();

  canister
    .expect_ego_controller_add()
    .times(1)
    .returning(|target_canister_id, user_address| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        Principal::from_text(USER_ADDRESS.to_string()).unwrap(),
        user_address
      );
    });

  canister.expect_ego_controller_remove().times(1).returning(
    |target_canister_id, factory_address| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        Principal::from_text(FACTORY_ID.to_string()).unwrap(),
        factory_address
      );
    },
  );

  canister
    .expect_ego_owner_set()
    .times(1)
    .returning(|target_canister_id, owners| {
      assert_eq!(
        Principal::from_text(CANISTER_1.to_string()).unwrap(),
        target_canister_id
      );
      assert_eq!(
        vec![Principal::from_text(USER_ADDRESS.to_string()).unwrap()],
        owners
      );
    });

  let contracts = Service::contract_list(NEW);
  assert_eq!(1, contracts.len());

  let contract = contracts.get(0).unwrap();

  assert_eq!(ADDRESS_1, contract.eoa_address.clone().unwrap());
  assert_eq!(CARD_CODE_1, contract.card_code);
  assert_eq!(ACTIVE_CODE_1, contract.active_code);
  assert_eq!(NEW, contract.status);
  assert_eq!(None, contract.email);

  let mut store = MockStore::new();
  let card = MockCard::new();

  store
    .expect_wallet_app_install()
    .times(1)
    .returning(|app_id| {
      assert_eq!("btc_wallet".to_string(), app_id);
      Ok(UserApp {
        app: App {
          app_id: "btc_wallet".to_string(),
          name: "btc_wallet".to_string(),
          category: Category::System,
          logo: "".to_string(),
          description: "".to_string(),
          current_version: Default::default(),
          price: 0.0,
          app_hash: "".to_string(),
        },
        canister: Canister {
          canister_id: Principal::from_text(CANISTER_1.to_string()).unwrap(),
          canister_type: CanisterType::BACKEND,
        },
        latest_version: Default::default(),
      })
    });

  match Service::active(
    &store,
    &card,
    &canister,
    &airdrop,
    CARD_CODE_1.to_string(),
    ACTIVE_CODE_1.to_string(),
    user_address,
    USER_EMAIL.to_string(),
    factory_address,
  )
    .await
  {
    Ok(_) => {
      let contracts = Service::contract_list(ContractStatus::ACTIVATED);
      assert_eq!(2, contracts.len());

      let contract = contracts
        .iter()
        .find(|contract| contract.card_code == CARD_CODE_1)
        .unwrap();
      assert_eq!(ADDRESS_1, contract.eoa_address.clone().unwrap());
      assert_eq!(CARD_CODE_1, contract.card_code);
      assert_eq!(ACTIVE_CODE_1, contract.active_code);
      assert_eq!(ContractStatus::ACTIVATED, contract.status);
      assert_eq!(Some(USER_EMAIL.to_string()), contract.email);
      assert_eq!(Some(user_address), contract.user_address);
    }
    Err(e) => {
      println!("error is {:?}", e);
      panic!("active failed")
    }
  }
}

#[tokio::test]
async fn active_already_active() {
  set_up_activated_case();

  let factory_address = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let mut store = MockStore::new();
  let mut card = MockCard::new();

  let mut canister = MockCanister::new();
  let airdrop = MockAirdrop::new();

  match Service::active(
    &store,
    &card,
    &canister,
    &airdrop,
    CARD_CODE_3.to_string(),
    ACTIVE_CODE_3.to_string(),
    user_address,
    USER_EMAIL.to_string(),
    factory_address,
  )
    .await
  {
    Ok(_) => {
      panic!("contract already_active")
    }
    Err(e) => {
      assert_eq!(404, e.code);
      assert_eq!("Already active", e.msg)
    }
  }

  canister.checkpoint();
  store.checkpoint();
  card.checkpoint();
}

#[tokio::test]
async fn active_wrong_active_code() {
  set_up_activated_case();

  let factory_address = Principal::from_text(FACTORY_ID.to_string()).unwrap();
  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let mut canister = MockCanister::new();
  let mut store = MockStore::new();
  let mut card = MockCard::new();
  let airdrop = MockAirdrop::new();

  match Service::active(
    &store,
    &card,
    &canister,
    &airdrop,
    CARD_CODE_1.to_string(),
    ACTIVE_CODE_3.to_string(),
    user_address,
    USER_EMAIL.to_string(),
    factory_address,
  )
    .await
  {
    Ok(_) => {
      panic!("wrong_active_code")
    }
    Err(e) => {
      assert_eq!(404, e.code);
      assert_eq!("Active code not right", e.msg)
    }
  }

  canister.checkpoint();
  store.checkpoint();
  card.checkpoint();
}

#[test]
fn get_contract() {
  set_up_activated_case();

  let contract = Service::get_contract(CARD_CODE_1.to_string()).unwrap();
  assert_eq!(contract.eoa_address.unwrap(), ADDRESS_1.to_string());
}

#[test]
fn get_eoa_address_wrong_code() {
  set_up_activated_case();

  let result = Service::get_contract(CARD_CODE_2.to_string());
  assert!(result.is_err());
}

#[test]
fn get_my_contracts() {
  set_up_activated_case();

  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let result = Service::get_my_contracts(user_address);
  assert_eq!(1, result.len())
}

#[tokio::test]
async fn deactive() {
  set_up_activated_case();

  let user_address = Principal::from_text(USER_ADDRESS.to_string()).unwrap();

  let contracts = Service::contract_list(ContractStatus::ACTIVATED);
  assert_eq!(1, contracts.len());

  let contract = contracts.get(0).unwrap();

  assert_eq!(ADDRESS_3, contract.eoa_address.clone().unwrap());
  assert_eq!(CARD_CODE_3, contract.card_code);
  assert_eq!(ContractStatus::ACTIVATED, contract.status);
  assert_eq!(user_address, contract.user_address.clone().unwrap());

  match Service::deactive(CARD_CODE_3.to_string()).await {
    Ok(_) => {
      let contracts = Service::contract_list(ContractStatus::NEW);
      assert_eq!(2, contracts.len());

      let contract = contracts
        .iter()
        .find(|contract| contract.card_code == CARD_CODE_3)
        .unwrap();
      assert_eq!(ADDRESS_3, contract.eoa_address.clone().unwrap());
      assert_eq!(CARD_CODE_3, contract.card_code);
      assert_eq!(ACTIVE_CODE_3, contract.active_code);
      assert_eq!(ContractStatus::NEW, contract.status);
      assert_eq!(None, contract.user_address);
    }
    Err(e) => {
      println!("error is {:?}", e);
      panic!("deactive failed")
    }
  }
}

#[test]
fn cards_export_and_import() {
  set_up_activated_case();

  let result = Service::cards_export();
  assert_eq!(2, result.len());

  CONTROLLER.with(|controller| {
    controller.borrow_mut().contracts.clear();
  });

  let contracts = Service::contract_list_all();
  assert_eq!(0, contracts.len());

  Service::cards_import(result);
  let contracts = Service::contract_list_all();
  assert_eq!(2, contracts.len());
}

#[test]
fn fix_contract_status(){
  CONTROLLER.with(|controller| {
    controller
      .borrow_mut()
      .contracts
      .entry(CARD_CODE_1.to_string())
      .or_insert(Contract {
        card_number: "".to_string(),
        contract_address: Principal::from_text(CANISTER_1.to_string()).unwrap(),
        eoa_address: Some(ADDRESS_1.to_string()),
        active_code: ACTIVE_CODE_1.to_string(),
        user_address: None,
        email: None,
        status: ContractStatus::ACTIVATED,
        card_code: CARD_CODE_1.to_string(),
      });
  });

  let contracts = Service::contract_list_all();
  let contract = contracts.get(0).unwrap();
  assert_eq!(ContractStatus::ACTIVATED, contract.status);

  Service::fix_contract_status();

  let contracts = Service::contract_list_all();
  let contract = contracts.get(0).unwrap();
  assert_eq!(NEW, contract.status);
}