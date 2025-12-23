/**
 * Lance une exception et indique à Typescript qu'il n'y aura
 * pas de suite au code. Permet d'utiliser inline
 * par exemple : toto ? "valeur" : throwError("mon erreur")
 *
 * Comme cela on estsûrs que typescript n'interprete pas
 * le code qui suit
 *
 * Permettra aussi plus tard de collecter nos exceptions
 *
 * @param message
 */
export const throwError = (message: string): never => {
  throw new Error(message);
};
