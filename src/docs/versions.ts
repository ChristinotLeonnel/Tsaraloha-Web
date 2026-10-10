// Correspondance version de TSA ↔ documentation. Une seule version documentée pour l'instant ;
// lorsqu'une nouvelle version de TSA sortira, ajouter ici l'entrée et, si besoin, un dossier de contenu.

/** Version de TSA décrite par la documentation publiée (product/ProductIdentity.h : kVersion). */
export const documentedVersion = '0.1.0';

/** Versions de TSA reconnues dans le paramètre « ?v= » envoyé par le bouton Aide du logiciel. */
export const knownVersions = ['0.1.0'];

/** Version transmise par TSA dans l'adresse (« ?v=0.1.0 »), si elle est bien formée. */
export function requestedVersion(): string | undefined {
  try {
    const v = new URLSearchParams(window.location.search).get('v');
    return v && /^\d+\.\d+\.\d+$/.test(v) ? v : undefined;
  } catch {
    return undefined;
  }
}
