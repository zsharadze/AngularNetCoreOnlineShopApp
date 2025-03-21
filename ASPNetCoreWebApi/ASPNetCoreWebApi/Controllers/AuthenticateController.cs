using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Extensions;
using ASPNetCoreWebApi.ResponseModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ASPNetCoreWebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthenticateController(UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
           SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                ModelState.AddModelError("Login", "Invalid credentials. try again.");
                return BadRequest(ModelState);
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, true);
            if (result.IsLockedOut)
            {
                return Unauthorized("User is locked out.");
            }
            else if (!result.Succeeded)
            {
                ModelState.AddModelError("Login", "Invalid credentials. try again.");
                return BadRequest(ModelState);
            }
            else if (result.Succeeded)
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var clims = new List<Claim>() {
                    new Claim("Email", user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                };

                foreach (var role in userRoles)
                {
                    clims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    claims: clims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                    );

                string tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

                return Ok(new LoginResponse
                {
                    UserEmail = user.Email,
                    UserRole = userRoles.First(),
                    Token = tokenAsString,
                    TokenExpiration = token.ValidTo
                });
            }

            ModelState.AddModelError("Login", "Unknown error.");
            return BadRequest(ModelState);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                ModelState.AddModelError("User", "User already exists!");
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email,
                RegistrationDate = DateTime.Now
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                ModelState.AddModelError("User", "User creation failed! Please check user details and try again.");
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }
            if (!model.RegisterAsAdmin)
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }
            else
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassword model)
        {
            if (model.NewPassword != model.ConfirmPassword)
            {
                ModelState.AddModelError("ChangePassword", "Confirm password does not match.");
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(User.GetCurrentUserId());
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var res = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (res.Succeeded)
            {
                return Ok();
            }
            else
            {
                ModelState.AddModelError("ChangePassword", "Old password is incorrect.");
                return BadRequest(ModelState);
            }
        }
    }
}
