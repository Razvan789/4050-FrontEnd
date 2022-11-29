//Loader is only used to pull from
interface loaderInterface {
    src: string;
}
export const myLoader = ({ src }: loaderInterface) => {
    return `${src}`
}