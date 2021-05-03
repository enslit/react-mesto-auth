class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _fetch(url, method = 'GET', body = null) {
    const fetchUrl = `${this._baseUrl}/${url}`;
    const options = {
      method,
      headers: this._headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(fetchUrl, options).then((res) => {
      if (!res.ok) {
        const error = new Error(
          `Error code ${res.status}. Message ${res.statusText}`
        );
        return Promise.reject(error);
      }
      return res.json();
    });
  }

  getUserInfo() {
    return this._fetch('users/me');
  }

  getCardList() {
    return this._fetch('cards');
  }

  updateProfile(data) {
    return this._fetch('users/me', 'PATCH', data);
  }

  postCard(card) {
    return this._fetch('cards', 'POST', card);
  }

  delete(id) {
    return this._fetch(`cards/${id}`, 'DELETE');
  }

  like(id, like = true) {
    return this._fetch(`cards/likes/${id}`, like ? 'PUT' : 'DELETE');
  }

  updateAvatar(data) {
    return this._fetch(`users/me/avatar`, 'PATCH', data);
  }
}

export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-21',
  headers: {
    authorization: '52186c90-0ae5-45bb-99b5-e4acaa2b939f',
    'Content-Type': 'application/json',
  },
});
