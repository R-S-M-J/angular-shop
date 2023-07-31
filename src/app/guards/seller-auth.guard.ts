import { CanActivateFn } from '@angular/router';
import { SellerAuthComponent } from '../components/seller-auth/seller-auth.component';
import { SellerService } from '../services/seller.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const sellerAuthGuard: CanActivateFn = (route, state) => {
  const currentSellerService=inject(SellerService);
  const router=inject(Router);
  if(localStorage.getItem('seller')){
    return true;
  }
  return currentSellerService.isSellerLoggedIn;
};