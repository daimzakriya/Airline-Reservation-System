const { CustomerRegInfo, CustomerLoginInfo } = require('./validators/customerInfo');
const CustomerService = require('../services/CustomerServices');
const { ymd} = require('../helpers/dateFormat');

class CustomerController {
    static async register(req, res) {
        try {
            const { value, error } = await CustomerRegInfo.validate(req.body);
            
            if (error) throw (error);
            await CustomerService.register(value);
            // automatic login after register
            const customer = await CustomerService.login(value);
            const formattedDob = ymd(new Date(customer.dob));
            customer.dob=formattedDob
            req.session.user = {};
            req.session.user.type = customer.type;
            req.session.user.customerData = customer;
            
            if (req.xhr) {
                return res.status(200).send({ result: 'redirect', url: '/' });
            } else {
                return res.redirect('/');
            }
        } catch (err) {
            const redirectUrl = `/?registrationError=${encodeURIComponent(err.message || err)}&email=${encodeURIComponent(req.body.email || '')}&firstName=${encodeURIComponent(req.body.firstName || '')}&lastName=${encodeURIComponent(req.body.lastName || '')}&dob=${encodeURIComponent(req.body.dob || '')}&gender=${encodeURIComponent(req.body.gender || '')}&contactNo=${encodeURIComponent(req.body.contactNo || '')}&passportNo=${encodeURIComponent(req.body.passportNo || '')}&addressLine1=${encodeURIComponent(req.body.addressLine1 || '')}&addressLine2=${encodeURIComponent(req.body.addressLine2 || '')}&city=${encodeURIComponent(req.body.city || '')}&country=${encodeURIComponent(req.body.country || '')}#signup`;
            if (req.xhr) {
                return res.status(200).send({
                    result: 'redirect',
                    url: redirectUrl,
                });
            } else {
                return res.redirect(redirectUrl);
            }
        }
    }

    static async login(req, res) {
        try {
            const { value, error } = await CustomerLoginInfo.validate(req.body);
            if (error) throw (error);
            const customer = await CustomerService.login(value);
            const formattedDob = ymd(new Date(customer.dob));
            customer.dob=formattedDob
            req.session.user = {};
            req.session.user.type = customer.type;
            req.session.user.customerData = customer;
            res.redirect('/');
        } catch (err) {
            res.redirect(`/?loginError=${err}#login`);
        }
    }

    static async logout(req, res) {
        try {
            req.session.user = undefined;
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    }


    static async getReview(req,res){
        try{
        res.render('customerReview', {
          user: req.session.user,
            registrationError: req.query.registrationError,
            loginError: req.query.loginError,
            regemail: req.query.email,
            regfirstName: req.query.firstName,
            reglastName: req.query.lastName,
            regdob: req.query.dob,
            reggender: req.query.gender,
            regcontactNo: req.query.contactNo,
            regpassportNo: req.query.passportNo,
            regaddressLine1: req.query.addressLine1,
            regaddressLine2: req.query.addressLine2,
            regcity: req.query.city,
            regcountry: req.query.country,
            custName: req.query.custName,
            address: req.query.address,
            custDob: req.query.custDob,
            custGender: req.query.custGender,
            custPassport: req.query.custPassport,
            mobile: req.query.mobile,
            custEmail: req.query.custEmail,
            dbError: req.query.dbError,
        });  }
        catch(err){
            console.log("error occured");
        }  
    }

    static async viewEditProfile(req, res) {
        res.render('editProfile', {
            // pass these to every page as you can register or login from any page
             user: req.session.user,
            registrationError: req.query.registrationError,
            loginError: req.query.loginError,
            regemail: req.query.email,
            regfirstName: req.query.firstName,
            reglastName: req.query.lastName,
            regdob: req.query.dob,
            reggender: req.query.gender,
            regcontactNo: req.query.contactNo,
            regpassportNo: req.query.passportNo,
            regaddressLine1: req.query.addressLine1,
            regaddressLine2: req.query.addressLine2,
            regcity: req.query.city,
            regcountry: req.query.country,
        });
    }

          
  

    static async createReview(req,res){
        try{
            //console.log(req.body.custID,req.body.review);
            const review=await CustomerService.createReview(req.body.custID,req.body.review);
            return res.status(200).redirect('/#reviews');
        }catch(err){
            const error="Number of characters cannot exceed 500!"
            return res.redirect(`/customer/createReview?dbError=${error}`);
        }

    }

 
    static async editProfile(req, res) {
        try {
            await CustomerService.editProfile(req.body);
            const customer = await CustomerService.getRegisteredCustomerByID(req.body.custID);
            req.session.user.customerData = customer;
            return res.status(200).send({ result: 'redirect', url: '/' });
        } catch (err) {
            return res.status(200).send({
                result: 'redirect',
                url: `/customer/editProfile?registrationError=${err}`
            });
        }
    }

    static async changePassword(req, res) {
        try {
            await CustomerService.changePassword(req.body);
            const customer = await CustomerService.getRegisteredCustomerByID(req.body.custID);
            req.session.user.customerData = customer;
            return res.status(200).send({ result: 'redirect', url: '/' });
        } catch (err) {
            return res.status(200).send({
                result: 'redirect',
                url: `/customer/editProfile?registrationError=${err}`
            });
        }
    }


}

module.exports = CustomerController;
