/* eslint-disable prefer-const */
import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
//REVISAR ESTA IMPORTACION DE HTTPErrors
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AutenticacionService} from '../services';


export class EstrategiaAdministrador implements AuthenticationStrategy {
  name = 'admin';

  constructor(
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService

  ) {


  }


  async authenticate(request: Request): Promise<UserProfile | undefined>{
    let token = parseBearerToken(request);
    if(token){
      let datos = this.servicioAutenticacion.validarTokenJWT(token);
      if(datos){
        let perfil: UserProfile = Object.assign({
          nombre:datos.data.nombre
        });
        return perfil;

        //ACA SE PUEDEN INGRESAR LOS ROLES
       // if(datos.data)

      }else{
        throw new HttpErrors[401]("El token incluido no es válido")
      }
    }else{
      throw new HttpErrors[401]("No se ha incluido un token en la solicitud")
    }
  }
}
