class FetchApi {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _fetch(url, method = 'GET', body = null, additionalHeaders = {}) {
    const fetchUrl = `${this._baseUrl}/${url}`;
    const options = {
      method,
      headers: Object.assign(this._headers, additionalHeaders),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(fetchUrl, options).then((res) => {
      if (!res.ok) {
        // const error = new Error(`Error code ${res.status}. ${res.statusText}`);
        // return Promise.reject(error);
      }
      return res.json();
    });
  }
}

class AuthApi extends FetchApi {
  register(email, password) {
    return this._fetch('signup', 'POST', { email, password });
  }

  auth(email, password) {
    return this._fetch('signin', 'POST', { email, password });
  }

  checkToken(token) {
    const additionalHeaders = {
      Authorization: `Bearer ${token}`,
    };

    return this._fetch('users/me', 'GET', null, additionalHeaders);
  }
}

class AppApi extends FetchApi {
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

export const api = new AppApi({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-21',
  headers: {
    authorization: '52186c90-0ae5-45bb-99b5-e4acaa2b939f',
    'Content-Type': 'application/json',
  },
});

export const auth = new AuthApi({
  baseUrl: 'https://auth.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  },
});
