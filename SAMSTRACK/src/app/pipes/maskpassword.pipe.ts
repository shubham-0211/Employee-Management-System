import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskpassword'
})
export class MaskpasswordPipe implements PipeTransform {



    transform(value: string): unknown {



      const visiblePart=value.slice(-2);
      const MaskedPart='*'.repeat(value.length-2);
      return MaskedPart+visiblePart ;
    }

  }


