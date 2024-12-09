document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('jsonInput');
  const applicationKeyInput = document.getElementById('applicationKey');
  const passwdInput = document.getElementById('passwd');
  const accessTypeInput = document.getElementById('accessType');
  const transactionIDInput = document.getElementById('transactionID');
  const requestURIInput = document.getElementById('requestURI');
  const validateJSONButton = document.getElementById('validateJSONButton');
  const form = document.getElementById('integration-form');
  const resetButton = document.getElementById('reset-button');
  const linkButton = document.getElementById('linkButton');
  const unlinkButton = document.getElementById('unlinkButton');
  const messageClearButton = document.getElementById('messageClearButton');
  const webviewMessageDisplay = document.getElementById('webviewMessageDisplay');

  // 입력값 로드 함수
  const loadInputs = () => {
    applicationKeyInput.value = localStorage.getItem('applicationKey') || '';
    passwdInput.value = localStorage.getItem('passwd') || '';
    accessTypeInput.value = localStorage.getItem('accessType') || '';
    transactionIDInput.value = localStorage.getItem('transactionID') || '';
    requestURIInput.value = localStorage.getItem('requestURI') || '';
    jsonInput.value = localStorage.getItem('jsonData') || '';
  };

  // 입력값 저장 함수
  const saveInputs = () => {
    localStorage.setItem('applicationKey', applicationKeyInput.value);
    localStorage.setItem('passwd', passwdInput.value);
    localStorage.setItem('accessType', accessTypeInput.value);
    localStorage.setItem('transactionID', transactionIDInput.value);
    localStorage.setItem('requestURI', requestURIInput.value);
    localStorage.setItem('jsonData', jsonInput.value);
  };

  // 페이지 로드 시 저장된 입력값 불러오기
  loadInputs();

  // 미리 정의된 JSON 메시지 템플릿
  const predefinedJSONMessages = {
    pointEarn: {
      type: 'connection',
      data: {
        supportMode: 'POINT_EARN',
        auth: null,
        transactionID: null,
        payAmount: 5000,
      },
    },
    pointRedeem: {
      type: 'connection',
      data: {
        supportMode: 'POINT_REDEEM',
        auth: null,
        transactionID: null,
        payAmount: 7000,
      },
    },
    coupon: {
      type: 'connection',
      data: {
        supportMode: 'COUPON',
        auth: null,
        transactionID: null,
        itemList: [
          {
            itemID: 'KD101111',
            itemName: '아메리카노',
            itemUnitPrice: 3000,
            itemCount: 3,
            itemPrice: 9000,
            itemOptionList: [
              {
                itemOptionID: 'KD101111-01',
                itemOptionName: '샷추가',
                itemOptionUnitPrice: 500,
                itemOptionCount: 2,
                itemOptionPrice: 1000,
              },
            ],
          },
        ],
      },
    },
    prepaid: {
      type: 'connection',
      data: {
        supportMode: 'PREPAID',
        auth: null,
        transactionID: null,
        payAmount: 5000,
      },
    },
    transactionConfirm: {
      type: 'confirm',
      data: {
        auth: null,
        transactionID: null,
        pointRedeemConfirmedYN: 'N',
        pointEarnConfirmedYN: 'Y',
        couponConfirmedYN: 'N',
        prepaidConfirmedYN: 'N',
        eReceiptIssueYN: 'N',
        itemList: [
          {
            itemID: 'KD101111',
            itemName: '아메리카노',
            itemUnitPrice: 3000,
            itemCount: 3,
            itemPrice: 9000,
            itemOptionList: [
              {
                itemOptionID: 'KD101111-01',
                itemOptionName: '샷추가',
                itemOptionUnitPrice: 500,
                itemOptionCount: 2,
                itemOptionPrice: 1000,
              },
            ],
          },
        ],
        paymentList: [
          {
            payment: 'PREPAID',
            paymentID: null,
            transactionID: null,
            paymentIssuer: null,
            cardPaymentPeriod: null,
            cardMerchantID: null,
            paymentPrice: 8500,
            prepaidBalance: 28000,
            pointBalance: 5500,
            paymentMemo: null,
          },
        ],
        netAmount: 9000,
        tax: 1000,
        discount: 1500,
        customerPaid: 8500,
        totalPaid: 10000,
        memo1: '',
        memo2: '',
        memo3: '',
        memo4: '',
        memo5: '',
      },
    },
    orderCancel: {
      type: 'cancel',
      data: {
        auth: null,
        transactionID: null,
      },
    },
  };

  // JSON 메시지 포맷팅 함수
  const formatJSONMessage = (message) => {
    return `<pre style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap;">${JSON.stringify(
      message,
      null,
      2
    )}</pre>`;
  };

  // 버튼 클릭 이벤트 처리
  document.querySelectorAll('.json-buttons-container button').forEach((button) => {
    button.addEventListener('click', () => {
      const jsonType = button.dataset.json;
      const template = JSON.parse(JSON.stringify(predefinedJSONMessages[jsonType]));

      if (template) {
        // 입력값으로 auth 및 transactionID 설정
        template.data.auth = {
          applicationKey: applicationKeyInput.value || 'defaultKey',
          passwd: passwdInput.value || 'defaultPass',
          accessType: accessTypeInput.value || 'defaultAccess',
        };
        template.data.transactionID = transactionIDInput.value || 'defaultTransactionID';

        jsonInput.value = JSON.stringify(template, null, 2);
        saveInputs();
      } else {
        alert('선택된 JSON 템플릿이 없습니다.');
      }
    });
  });

  // JSON 유효성 검사
  validateJSONButton.addEventListener('click', () => {
    try {
      JSON.parse(jsonInput.value);
      alert('JSON is valid!');
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  });

  // 폼 제출 시 데이터 저장
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveInputs();
    alert('Data saved!');
  });

  // 초기화 버튼
  resetButton.addEventListener('click', () => {
    localStorage.clear();
    form.reset();
    jsonInput.value = '';
    applicationKeyInput.value = '';
    passwdInput.value = '';
    accessTypeInput.value = '';
    transactionIDInput.value = '';
    requestURIInput.value = '';
    alert('Form and local storage cleared.');
  });

  // Webview 관련
  let modal;

  // 연동 버튼 클릭
  linkButton.addEventListener('click', () => {
    const requestURI = requestURIInput.value;
    const message = JSON.parse(jsonInput.value);

    if (!requestURI || !message) {
      alert('Request URI와 JSON 메시지를 확인하세요.');
      return;
    }

    createModalWebview(requestURI, message);
  });

  // 연동 해제 버튼 클릭
  unlinkButton.addEventListener('click', closeModal);

  // 메세지 초기화 버튼 클릭
  messageClearButton.addEventListener('click', clearMessage);

  function createModalWebview(url, message) {
    modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.zIndex = '1000';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.width = '80%';
    modalContent.style.height = '80%';
    modalContent.style.position = 'relative';
    modalContent.style.borderRadius = '10px';

    const webview = document.createElement('webview');
    webview.src = url;
    webview.style.width = '100%';
    webview.style.height = '100%';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'red';
    closeButton.style.color = 'white';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';

    closeButton.addEventListener('click', closeModal);

    modalContent.appendChild(webview);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.body.appendChild(modal);

    setTimeout(() => {
      postMessageToWebview(webview.contentWindow, message);
    }, 1000);
  }

  function postMessageToWebview(webviewWindow, message) {
    const newMessage = `
      <h3>웹뷰로 보낸 메시지</h3>
      <time>${new Date().toLocaleString()}</time>
      ${formatJSONMessage(message)}
      <hr />
    `;
    webviewMessageDisplay.innerHTML = newMessage + webviewMessageDisplay.innerHTML;

    webviewWindow.postMessage(message, '*');
  }

  function closeModal() {
    if (modal) {
      document.body.removeChild(modal);
      modal = null;
    }
  }

  function clearMessage() {
    const newMessage = `
      <p class="webview-message-title">웹뷰 메시지가 여기에 표시됩니다.</p>
      <div class="webview-message-content"></div>
    `;
    webviewMessageDisplay.innerHTML = newMessage;
  }

  // Webview로부터 메시지 수신
  window.addEventListener('message', (event) => {
    const receivedMessage = `
      <h3>웹뷰로부터 받은 메시지</h3>
      <time>${new Date().toLocaleString()}</time>
      ${formatJSONMessage(event.data)}
      <hr />
    `;
    webviewMessageDisplay.innerHTML = receivedMessage + webviewMessageDisplay.innerHTML;

    if (modal) closeModal();
  });
});
