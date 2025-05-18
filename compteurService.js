const STORAGE_KEY = 'compteursPoker';

export const compteurService = {
  load() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  save(compteurs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compteurs));
  },

  increment(main) {
    const compteurs = this.load();
    compteurs[main] = (compteurs[main] || 0) + 1;
    this.save(compteurs);
  },

  getCount(main) {
    const compteurs = this.load();
    return compteurs[main] || 0;
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
