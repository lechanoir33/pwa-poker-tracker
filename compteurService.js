window.compteurService = {
  increment(main) {
    let data = localStorage.getItem('compteursPoker');
    let compteurs = data ? JSON.parse(data) : {};
    compteurs[main] = (compteurs[main] || 0) + 1;
    localStorage.setItem('compteursPoker', JSON.stringify(compteurs));
  },

  getCount(main) {
    let data = localStorage.getItem('compteursPoker');
    let compteurs = data ? JSON.parse(data) : {};
    return compteurs[main] || 0;
  }
};
